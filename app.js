let state = {
  prefix: '',
  url: {
    base: '',
    params: [],
    hash: ''
  },
  suffix: ''
};

const inputField = document.getElementById('input');
const prefixInput = document.getElementById('prefix');
const urlBaseInput = document.getElementById('urlBase');
const suffixInput = document.getElementById('suffix');
const paramsContainer = document.getElementById('params');
const editor = document.getElementById('editor');
const resultSection = document.getElementById('resultSection');
const resultElement = document.getElementById('result');


function extractURL(text) {
  /* 
    Extract URL from text 
  */
  const urlRegex = /(https?:\/\/[^\s]+)/;
  const match = text.match(urlRegex);

  if (!match) return null;

  const url = match[0];
  const urlStart = match.index;
  const urlEnd = urlStart + url.length;

  return {
    prefix: text.substring(0, urlStart),
    url: url,
    suffix: text.substring(urlEnd)
  };
}

function parseURL(urlString) {
  /* 
    Parse URL into components 
  */
  const url = new URL(urlString);
  const params = [];

  url.searchParams.forEach((value, key) => {
    params.push({ key, value, enabled: true });
  });

  return {
    base: url.origin + url.pathname,
    params: params,
    hash: url.hash
  };
}

function matchRule(urlBase) {
  /* 
    Match domain rules 
  */
  for (const [domain, requiredParams] of Object.entries(URL_RULES)) {
    if (urlBase.includes(domain)) {
      return requiredParams;
    }
  }
  return null;
}

function applyRules(params, urlBase) {
  /* 
    Apply rules to parameters 
  */
  const rule = matchRule(urlBase);
  const allowedSet = rule === null ? null : new Set(rule);

  params.forEach(param => {
    param.enabled = allowedSet ? allowedSet.has(param.key) : true;
  });
}

function buildURL() {
  /* 
    Build clean URL 
  */
  const enabledParams = state.url.params.filter(p => p.enabled);
  const queryString = enabledParams
    .map(p => `${p.key}=${p.value}`)
    .join('&');

  let cleanURL = state.url.base;
  if (queryString) {
    cleanURL += '?' + queryString;
  }
  if (state.url.hash) {
    cleanURL += state.url.hash;
  }

  // Ensure proper spacing
  let prefix = state.prefix;
  let suffix = state.suffix;
  if (prefix && !prefix.endsWith(' ') && !prefix.endsWith('\n')) { prefix += ' '; }
  if (suffix && !suffix.startsWith(' ') && !suffix.startsWith('\n')) { suffix = ' ' + suffix; }

  return prefix + cleanURL + suffix;
}

function render() {
  /* 
    Render the editor 
  */
  prefixInput.value = state.prefix;
  urlBaseInput.value = state.url.base + state.url.hash;
  suffixInput.value = state.suffix;

  // Render parameters
  paramsContainer.innerHTML = '';

  if (state.url.params.length === 0) {
    paramsContainer.innerHTML = '<div style="color: #999; font-size: 13px; padding: 12px;">No parameters</div>';
  } else {
    state.url.params.forEach((param, index) => {
      const div = document.createElement('div');
      div.className = 'param-item' + (param.enabled ? '' : ' disabled');
      div.onclick = () => toggleParam(index);

      div.innerHTML = `
        <input type="checkbox"
               class="param-checkbox"
               ${param.enabled ? 'checked' : ''}
               onclick="event.stopPropagation(); toggleParam(${index})">
        <div class="param-content">
          <span class="param-key">${param.key}</span> = <span class="param-value">${param.value}</span>
        </div>
      `;

      paramsContainer.appendChild(div);
    });
  }

  // Update result
  const resultText = buildURL();
  resultElement.textContent = resultText;
}

function toggleParam(index) {
  /* 
    Toggle parameter 
  */
  state.url.params[index].enabled = !state.url.params[index].enabled;
  render();
}

/* Handle input */
inputField.addEventListener('input', function(e) {
  const text = e.target.value.trim();
  if (!text) return;

  const extracted = extractURL(text);
  if (!extracted) {
    showToast('No URL found in the text');
    inputField.value = '';
    return;
  }

  const parsed = parseURL(extracted.url);
  applyRules(parsed.params, parsed.base);
  state.prefix = extracted.prefix;
  state.url = parsed;
  state.suffix = extracted.suffix;

  editor.classList.remove('hidden');
  resultSection.classList.remove('hidden');
  e.target.value = '';
  render();
});

/* Handle editor input changes */
prefixInput.addEventListener('input', function(e) {
  state.prefix = e.target.value;
  render();
});

urlBaseInput.addEventListener('input', function(e) {
  const value = e.target.value;
  const hashIndex = value.indexOf('#');

  if (hashIndex !== -1) {
    state.url.base = value.substring(0, hashIndex);
    state.url.hash = value.substring(hashIndex);
  } else {
    state.url.base = value;
    state.url.hash = '';
  }

  render();
});

suffixInput.addEventListener('input', function(e) {
  state.suffix = e.target.value;
  render();
});

function copyResult() {
  /* 
    Copy result to clipboard 
  */
  const result = buildURL();
  navigator.clipboard.writeText(result).then(() => {
    showToast('Copied to clipboard!');
  });
}

function showToast(message) {
  /* 
    Show toast notification 
  */
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}
