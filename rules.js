// URL cleaning rules
// Format: { "domain": ["param1", "param2", ...] }
// Empty array means remove all parameters
const URL_RULES = {
  "xiaohongshu.com": ["xsec_token"],
  "zhihu.com": [],
  "bilibili.com": ["p", "t"],
};
