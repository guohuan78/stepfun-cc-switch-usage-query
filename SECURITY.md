# Security

请不要在 Issue、Pull Request、截图或日志中提交以下内容：

- Step API key
- Oasis-Token
- Cookie
- web_id、账户 ID 或其他会话标识
- 未脱敏的浏览器截图

如果凭证已经泄露，请立即刷新登录会话或撤销对应 API key。

提交前请检查：

    git diff --cached
    git grep -n -E "eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.|Oasis-Token|Cookie:"

本项目的脚本只使用占位符，不需要真实凭证才能阅读或配置。
