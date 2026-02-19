import React, { useState, useEffect, useRef } from 'react';
import { hotelApi, adminApi, HotelStatus } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import * as echarts from 'echarts';
import { AuthService } from '../../utils/auth';

// 注册中国地图
import chinaMapData from '../../assets/map/china.json';

const HotelVisualization: React.FC = () => {
  const [hotelData, setHotelData] = useState<any[]>([]);
  const [auditData, setAuditData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState<'country' | 'province'>('country');
  const [currentProvince, setCurrentProvince] = useState<string>('');
  const mapRef = useRef<HTMLDivElement>(null);
  const pieRef = useRef<HTMLDivElement>(null);
  const mapChart = useRef<echarts.ECharts | null>(null);
  const pieChart = useRef<echarts.ECharts | null>(null);
  
  // 获取当前用户角色
  const currentUser = AuthService.getCurrentUser();
  const userRole = currentUser?.role || 'merchant';

  // 区县数据映射（从API获取数据后填充）
  const cityData: Record<string, any[]> = {};

  // 初始化图表
  useEffect(() => {
    if (!mapRef.current || !pieRef.current) return;

    // 注册中国地图
    echarts.registerMap('china', chinaMapData);

    // 初始化地图图表
    mapChart.current = echarts.init(mapRef.current);
    // 初始化饼图图表
    pieChart.current = echarts.init(pieRef.current);

    // 加载实际数据
    const loadData = async () => {
      try {
        let response;
        if (userRole === 'admin') {
          // 管理员角色，调用审核可视化接口
          response = await adminApi.getAuditVisualizationData();
        } else {
          // 商户角色，调用酒店可视化接口
          response = await hotelApi.getHotelVisualizationData();
        }
        if (response.success && response.data) {
          setHotelData(response.data.provinceData);
          setAuditData(response.data.auditData);
        }
      } catch (error) {
        console.error('获取可视化数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // 监听地图点击事件
    mapChart.current.on('click', (params: any) => {
      if (currentLevel === 'country' && params.name) {
        // 点击省市，切换到区县视图
        const provinceName = params.name;
        if (cityData[provinceName]) {
          setCurrentProvince(provinceName);
          setCurrentLevel('province');
          setHotelData(cityData[provinceName]);
        }
      }
    });

    // 监听窗口大小变化，调整图表大小
    const resizeHandler = () => {
      mapChart.current?.resize();
      pieChart.current?.resize();
    };

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      mapChart.current?.dispose();
      pieChart.current?.dispose();
    };
  }, [currentLevel, currentProvince]);

  // 更新图表数据
  useEffect(() => {
    if (loading || !mapChart.current || !pieChart.current) return;

    // 更新地图图表
    const mapOption = {
      title: {
        text: currentLevel === 'country' ? '全国酒店分布' : `${currentProvince}酒店分布`,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        },
        subtext: currentLevel === 'province' ? '点击返回全国视图' : '',
        subtextStyle: {
          color: '#1890ff',
          cursor: 'pointer'
        },
        triggerEvent: true
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}家酒店'
      },
      visualMap: {
        min: 0,
        max: currentLevel === 'country' ? 10 : 5,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'],
        calculable: true,
        inRange: {
          color: ['#f5f5f5', '#ff6b6b', '#ee5a52', '#c0392b']
        }
      },
      series: [
        {
          name: '酒店数量',
          type: 'map',
          map: 'china',
          roam: true,
          label: {
            show: true,
            fontSize: 10
          },
          data: hotelData
        }
      ]
    };

    mapChart.current.setOption(mapOption);

    // 监听标题点击事件，返回全国视图
    if (currentLevel === 'province') {
      mapChart.current.on('click', async (params: any) => {
        if (params.componentType === 'title') {
          setCurrentLevel('country');
          setCurrentProvince('');
          // 重新加载全国数据
          try {
            let response;
            if (userRole === 'admin') {
              // 管理员角色，调用审核可视化接口
              response = await adminApi.getAuditVisualizationData();
            } else {
              // 商户角色，调用酒店可视化接口
              response = await hotelApi.getHotelVisualizationData();
            }
            if (response.success && response.data) {
              setHotelData(response.data.provinceData);
            }
          } catch (error) {
            console.error('获取全国数据失败:', error);
          }
        }
      });
    }

    // 定义审核状态颜色映射
    const statusColors = {
      '已发布': '#52c41a',
      '审核中': '#1890ff',
      '已拒绝': '#ff4d4f',
      '已下线': '#8c8c8c'
    };

    // 更新饼图图表
    const pieOption = {
      title: {
        text: '审核状态分布',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}家 ({d}%)'
      },
      series: [
        {
          name: '审核状态',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '40%'],
          data: auditData.map(item => ({
            ...item,
            itemStyle: {
              color: statusColors[item.name] || '#8c8c8c'
            }
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: false
          },
          labelLine: {
            show: false
          }
        }
      ]
    };

    pieChart.current.setOption(pieOption);
  }, [loading, hotelData, auditData]);

  return (
    <div className="hotel-visualization-container">
      <PageHeader title="酒店分布可视化" />

      <div className="visualization-content">
        <div className="map-container" ref={mapRef}></div>
        <div className="pie-container">
          <div className="pie-chart" ref={pieRef}></div>
          <div className="audit-status-counts">
            {auditData.map((item, index) => {
              // 定义审核状态颜色映射
              const statusColors = {
                '已发布': '#52c41a',
                '审核中': '#1890ff',
                '已拒绝': '#ff4d4f',
                '已下线': '#8c8c8c'
              };
              const color = statusColors[item.name] || '#8c8c8c';
              return (
                <div key={index} className="status-count-item">
                  <div className="status-name-with-dot">
                    <span className="status-dot" style={{ backgroundColor: color }}></span>
                    <span>{item.name}</span>
                  </div>
                  <span className="status-count">{item.value}家</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelVisualization;