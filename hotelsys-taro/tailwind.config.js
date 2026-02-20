/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
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
                "custom-placeholder": "#d0d0d0",
                dark: {
                    bg: '#18181b',      // zinc-900 (背景深色)
                    card: '#27272a',    // zinc-800 (卡片背景)
                    text: '#f4f4f5',    // zinc-100 (主要文字)
                    muted: '#a1a1aa',   // zinc-400 (次要文字)
                }
            },
        }
    }
}