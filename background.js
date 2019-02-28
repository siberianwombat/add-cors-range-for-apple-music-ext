const requestFilter = {
	urls: ['https://*.itunes.apple.com/*']
}
const UrlReg = new RegExp('\.mp4$', 'i');

chrome.webRequest.onHeadersReceived.addListener(
    function(dt) {
        if (dt.initiator) {
            if (dt.method !== 'OPTIONS' || !UrlReg.test(dt.url)) return;
            var headerId = dt.responseHeaders.findIndex((header) => {
                return header.name.toLowerCase() === 'access-control-allow-headers'
            });
            if (headerId >= 0) {
                if (dt.responseHeaders[headerId].value === '*') return;
                if (dt.responseHeaders[headerId].value.toLowerCase().includes('range')) return;
                dt.responseHeaders[headerId].value += ',range'
            } else {
                dt.responseHeaders.push({ name:'access-control-allow-headers', value: 'range' })
            }
			return {responseHeaders: dt.responseHeaders}
        }
    },
    requestFilter, ['blocking', 'responseHeaders']
)