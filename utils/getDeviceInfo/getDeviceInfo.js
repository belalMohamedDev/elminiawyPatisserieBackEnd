exports.getDeviceInfo = (req) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return {
      ip,
      browser: req.useragent.browser,
      version: req.useragent.version,
      os: req.useragent.os,
      platform: req.useragent.platform,
    };
  };