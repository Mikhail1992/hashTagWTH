export { consumeTemplates, instantiateTemplate };

var domTemplates = {};

function consumeTemplates(options) {
	var domId = options.domId,
	    html = options.html,
	    module = options.module;

	var consumed = false;

	if (html || document.readyState === 'interactive' || document.readyState === 'complete') {
		consume();
	} else {
		window.addEventListener('readystatechange', checkLoad);
		window.addEventListener('DOMContentLoaded', checkLoad);
	}

	function checkLoad() {
		if (document.readyState === 'interactive' || document.readyState === 'complete') consume();
	}

	function consume() {
		if (consumed) return;
		consumed = true;

		var templatesContainerEl;

		if (html) {
			templatesContainerEl = document.createElement('div');
			templatesContainerEl.innerHTML = html;
		} else {
			templatesContainerEl = document.getElementById(domId);
			if (!templatesContainerEl) { console.error('domtemplates:noelement', options); return; }
		}

		var moduleTemplates = domTemplates[module] || (domTemplates[module] = {});

		var elements = templatesContainerEl.querySelectorAll('[data-template-id]');
		for (var i = 0; i < elements.length; i++) {
			var el = elements[i];
			if (!el || !el.getAttribute) continue;

			var templateId = el.getAttribute('data-template-id');

			if (templateId) {
				el.removeAttribute('data-template-id');
				moduleTemplates[templateId] = el;
			}
		}

		if (!html) {
			templatesContainerEl.parentNode.removeChild(templatesContainerEl);
		}
	}
};

// WARN: you cannot use it immediately after page load
// TODO: onTemplatesLoaded/onTemplateLoaded/etc
function instantiateTemplate(module, id, options) {
	var moduleTemplates = domTemplates[module];
	if (!moduleTemplates) {
		console.error('domtemplates:nomodule', { module: module, id: id });
		return null;
	}

	var templateEl = moduleTemplates[id];
	if (!templateEl || !templateEl.cloneNode) {
		console.error('domtemplates:notemplate', { module: module, id: id });
		return null;
	}

	var clone = templateEl.cloneNode(true /* deep */);

	clone.removeAttribute('id');

	if (options && options.contentAsFragment) {
		var fragment = document.createDocumentFragment();

		var el = clone.firstChild;

		while (el) {
			var node = el;
			el = el.nextSibling; // `nextSibling` will change after appending to fragment

			fragment.appendChild(node);
		}

		return fragment;
	}

	return clone;
};