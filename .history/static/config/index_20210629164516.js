/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {};

  // api接口请求地址
  // window.SITE_CONFIG['baseUrl'] = 'http://localhost:8080/sva';
  // window.SITE_CONFIG['baseUrl'] = 'http://api.gronhco.cn/sva';
  // window.SITE_CONFIG['baseUrl'] = 'http://152.32.172.3:8080/sva';
  window.SITE_CONFIG['baseUrl'] = 'http://localhost:8080/sva';
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();
