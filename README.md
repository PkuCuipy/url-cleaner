# URL Cleaner

URL Cleaner helps minimize shareable links by identifying and removing tracking parameters while preserving essential ones, resulting in shorter, cleaner URLs without sacrificing functionality.

## Features

- **Parameters Extraction**: Extracts and displays all URL parameters individually
- **Parameters Toggling**: Click any parameter to enable/disable it in the final URL
- **Domain-specific Rules**: Automatically applies predefined rules for known domains (e.g., xiaohongshu.com, zhihu.com, bilibili.com, etc.)
- **Context Preservation**: Maintains texts before/after the URL

## Usage

1. Paste text containing a URL into the input field
2. Toggle parameters on/off as needed
3. Edit prefix/suffix if necessary
4. Click the result to copy the cleaned URL

## Example

**Original URL:**
```
https://www.xiaohongshu.com/discovery/item/693b08c2000000001e027950?app_platform=ios&app_version=9.12.2&share_from_user_hidden=true&xsec_source=app_share&type=normal&xsec_token=CBHsIW0UzbmqqcQVVl6A_UTvfviOF450Frc_q0IG5xiLU=&author_share=1&xhsshare=WeixinSession&shareRedId=N0w6Qjk6NE82NzUyOTgwNjY0OThINjw8&apptime=1765513122&share_id=867c0c46d5904f3fbec54b63c5a6fa92
```

**Cleaned URL:**
```
https://www.xiaohongshu.com/discovery/item/693b08c2000000001e027950?xsec_token=CBHsIW0UzbmqqcQVVl6A_UTvfviOF450Frc_q0IG5xiLU=
```

## Contributing this Project

The file `rules.js` contains domain-specific rules for URL parameter retention. You can contribute this repo by adding/refining the rules via pull requests.

```javascript
const URL_RULES = {
  "xiaohongshu.com": ["xsec_token"],  // Keep only xsec_token
  "zhihu.com": [],                    // Remove all parameters
  "bilibili.com": ["p", "t"],         // Keep p and t parameters
  /* ... */
  /* more rules go here */
  /* ... */
};
```
