# StepFun Step Plan 用量查询 for CC Switch

将新版 StepFun Step Plan 的月度 Credit 剩余比例接入 CC Switch 的 Usage Query。

> 当前版本只显示百分比：已用、总量 100%、剩余。
> 不使用旧版 5 小时或周限额字段，也不包含任何真实 API key、Token、账号信息。

## 仓库内容

- stepfun-cc-switch-usage-query.js：可直接粘贴到 CC Switch 的脚本模板
- USAGE.md：完整配置、凭证获取和错误排查说明
- SECURITY.md：提交前的敏感信息检查清单

本仓库不包含截图、真实 API key、Oasis-Token、Cookie 或账号信息。

## 快速使用

### 1. 获取网页登录凭证

必须在同一个已登录的 StepFun 浏览器会话中获取下面两个值。

#### Access Token：完整的 Oasis-Token

方法 A：浏览器界面获取

1. 打开并登录 <https://platform.stepfun.com>。
2. 按 F12 打开开发者工具。
3. 进入 Application / 应用程序。
4. 打开 Storage → Cookies → https://platform.stepfun.com。
5. 找到名为 Oasis-Token 的 Cookie，复制 Value 的完整内容。

方法 B：Console 获取

在 StepFun 页面对应的 Console 执行：

    (() => {
      const item = document.cookie
        .split(";")
        .map((s) => s.trim())
        .find((x) => x.startsWith("Oasis-Token="));
      return item
        ? decodeURIComponent(item.slice("Oasis-Token=".length))
        : "未找到 Oasis-Token";
    })()

复制结果时保持单行。若 Token 中本来含有三个连续的点号，不要自行删除或拆分。

#### User ID：网页的 web_id

方法 A：浏览器界面获取

1. 仍在 Application / 应用程序页面。
2. 打开 Local Storage → https://platform.stepfun.com。
3. 找到 key 为 web_id 的条目，复制 Value。

方法 B：Console 获取

    localStorage.getItem("web_id")

这里的 User ID 是 web_id / 设备标识，不是账户的数字 oasis_id。两个值必须来自同一个浏览器会话。

### 2. 在 CC Switch 中配置

1. 打开目标 StepFun provider 的 Usage Query。
2. 打开 Enable Usage Query。
3. 类型选择 Custom。
4. 将 [stepfun-cc-switch-usage-query.js](stepfun-cc-switch-usage-query.js) 全部粘贴到脚本框。
5. Base URL 填写：

       https://platform.stepfun.com

6. 在脚本中手动替换下面两个标记：

       PASTE_OASIS_TOKEN_HERE
       PASTE_WEB_ID_HERE

   - 将 PASTE_OASIS_TOKEN_HERE 替换为完整 Oasis-Token。
   - 将 PASTE_WEB_ID_HERE 替换为 web_id。
   - 只替换双引号内的标记，保留双引号。
   - 不要添加 Bearer、Cookie: 或 Oasis-Token= 前缀。
   - 不要把替换后的脚本提交回 Git 仓库。

7. 点击 Test Script，成功后保存。

### 3. 验证结果

成功后，CC Switch 会显示：

    已用：12.5%
    总量：100%
    剩余：87.5%

完整参数、错误排查和字段说明见 [USAGE.md](USAGE.md)。

## 实现要点

请求接口：

    POST https://platform.stepfun.com/api/step.openapi.devcenter.Dashboard/QueryStepPlanRateLimit

新版接口的核心字段位于：

    response.planCreditRateLimit.subscriptionCreditLeftRate

脚本同时兼容 camelCase 和 snake_case 字段，并兼容 0~1、0~100 两种比例表达。

## 常见问题

### QuickJS 解析失败

- 不要粘贴 Markdown 代码围栏。
- 脚本必须整体用括号包裹。
- Access Token 不能包含换行符。
- 如果手动替换 Token，粘贴前确认它没有换行。

### 401 Unauthorized / oasis-token is embezzled

重新登录 StepFun，然后同时复制新的 Oasis-Token 和 web_id。确认没有添加 Bearer、Cookie: 等前缀。

### 测试成功但没有显示

确认 Usage Query 已启用、配置已保存，并且 provider 当前处于 Active 状态。

## 安全与隐私

- 仓库内容不应包含真实 API key、Oasis-Token、Cookie、账号 ID 或个人截图。
- 提交前运行敏感信息扫描，重点检查 API key 前缀、JWT 三段式字符串、Cookie 和本地路径。
- Oasis-Token 是网页登录会话凭证，不要提交到公开仓库或 Issue。
- 本项目当前面向 private 仓库整理；改为 public 前请再次检查提交历史、脚本内容和 GitHub Actions 日志。

## 官方链接

- [StepFun 用量页面](https://platform.stepfun.com/plan-usage)
- [StepFun Step Plan](https://platform.stepfun.com/step-plan?channel=step-dev)
- [CC Switch 用量查询文档](https://github.com/farion1231/cc-switch-website/blob/main/public/docs/en/2-providers/2.5-usage-query.md)
