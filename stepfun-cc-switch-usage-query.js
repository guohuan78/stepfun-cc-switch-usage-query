({
  request: {
    url: "https://platform.stepfun.com/api/step.openapi.devcenter.Dashboard/QueryStepPlanRateLimit",
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Oasis-Token": "PASTE_OASIS_TOKEN_HERE",
      "Oasis-Webid": "PASTE_WEB_ID_HERE",
      "Oasis-appID": "10300",
      "Oasis-Platform": "web",
      "Oasis-Language": "zh-CN",
      "User-Agent": "cc-switch/1.0"
    },
    body: "{}"
  },

  extractor: function (response) {
    var root = response || {};

    if (root.data && typeof root.data === "object") {
      root = root.data;
    }

    var limit =
      root.planCreditRateLimit ||
      root.plan_credit_rate_limit ||
      root;

    var left = limit.subscriptionCreditLeftRate;

    if (left === undefined) {
      left = limit.subscription_credit_left_rate;
    }

    left = parseFloat(left);

    if (isNaN(left)) {
      return {
        isValid: false,
        invalidMessage:
          "未找到 planCreditRateLimit.subscriptionCreditLeftRate"
      };
    }

    // 接口通常返回 0~1；兼容 0~100 的返回格式。
    if (left > 1) {
      left = left / 100;
    }

    left = Math.max(0, Math.min(1, left));

    var remaining = Math.round(left * 10000) / 100;

    return {
      isValid: true,
      planName: "Step Plan 月度 Credit",
      used: Math.round((100 - remaining) * 100) / 100,
      total: 100,
      remaining: remaining,
      unit: "%",
      extra: ""
    };
  }
})
