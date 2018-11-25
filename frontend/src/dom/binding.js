export { binding };

function binding(el, options) {
	if (Array.isArray(el)) {
		var binding = {};

		el.forEach(function(x) { doBinding(x, options, binding); });

		return binding;
	} else {
		return doBinding(el, options);
	}
}

function doBinding(el, options, binding) {
	if (!binding) binding = {};

	handleAttribute('data-element', function(el, key) {
		binding[key] = el;
	});

	if (options) {
		handleAttribute('data-text', function(el, key) {
			var text = options[key];
			if (!text) return;

			el.textContent = text;
		});

		handleAttribute('data-html', function(el, key) {
			var html = options[key];
			if (!html) return;

			el.innerHTML = html;
		});

		handleAttribute('data-img-src', function(el, key) {
			var url = options[key];
			if (!url) url = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // empty pixel

			el.src = url;
		});

		bindEvent('data-onclick', 'click');

		handleAttribute('data-show', function(el, key) {
			el.style.display = options[key] ? '' : 'none';
		});
	}

	function handleAttribute(attr, f) {
		if (el.getAttribute) { // `el` can be a DocumentFragment
			var attrValue = el.getAttribute(attr);

			if (attrValue) {
				f(el, attrValue);
			}
		}

		Array.from(el.querySelectorAll('[' + attr + ']')).forEach(function(el) {
			f(el, el.getAttribute(attr));
		});
	}

	function bindEvent(attributeName, eventName) {
		handleAttribute(attributeName, function(el, key) {
			if (typeof options[key] !== 'function') return;

			var handler = options[key];

			el.addEventListener(eventName, handler);

			cancels.push(function() {
				el.removeEventListener(eventName, handler);
			});
		});
	}

	return binding;
}