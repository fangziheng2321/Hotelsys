/** @type {import('tailwindcss').Config} */
module.exports = {
    // 这里给出了一份 uni-app /taro 通用示例，具体要根据你自己项目的目录结构进行配置
    // 不在 content 包括的文件内，你编写的 class，是不会生成对应的css工具类的
    content: ['./public/index.html', './src/**/*.{html,js,ts,jsx,tsx,vue}'],
    // 其他配置项
    corePlugins: {
        // 小程序不需要 preflight
        preflight: false
    },
    theme: {
        extend: {
            colors: {
                primary: "var(--brand-color)",
                secondary: "var(--brand-color-secondary)",
                "custom-gray": "#e9edf0",
                "custom-placeholder": "#d0d0d0"
            },
        }
    }
}