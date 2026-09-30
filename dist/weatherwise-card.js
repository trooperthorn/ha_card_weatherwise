//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, re = f.trustedTypes, ie = re ? re.emptyScript : "", ae = f.reactiveElementPolyfillSupport, p = (e, t) => e, m = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ie : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, h = (e, t) => !l(e, t), oe = {
	attribute: !0,
	type: String,
	converter: m,
	reflect: !1,
	useDefault: !1,
	hasChanged: h
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var g = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = oe) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? oe;
	}
	static _$Ei() {
		if (this.hasOwnProperty(p("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(p("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(p("properties"))) {
			let e = this.properties, t = [...ee(e), ...te(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? m : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? m : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? h)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
g.elementStyles = [], g.shadowRootOptions = { mode: "open" }, g[p("elementProperties")] = /* @__PURE__ */ new Map(), g[p("finalized")] = /* @__PURE__ */ new Map(), ae?.({ ReactiveElement: g }), (f.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var se = globalThis, ce = (e) => e, _ = se.trustedTypes, le = _ ? _.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ue = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, y = "?" + v, de = `<${y}>`, b = document, x = () => b.createComment(""), S = (e) => e === null || typeof e != "object" && typeof e != "function", C = Array.isArray, fe = (e) => C(e) || typeof e?.[Symbol.iterator] == "function", w = "[ 	\n\f\r]", T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, pe = /-->/g, me = />/g, E = RegExp(`>|${w}(?:([^\\s"'>=/]+)(${w}*=${w}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), he = /'/g, ge = /"/g, _e = /^(?:script|style|textarea|title)$/i, ve = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), D = ve(1), O = ve(2), k = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), ye = /* @__PURE__ */ new WeakMap(), j = b.createTreeWalker(b, 129);
function be(e, t) {
	if (!C(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return le === void 0 ? t : le.createHTML(t);
}
var xe = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = T;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === T ? c[1] === "!--" ? o = pe : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = E) : (_e.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = E) : o = me : o === E ? c[0] === ">" ? (o = i ?? T, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? E : c[3] === "\"" ? ge : he) : o === ge || o === he ? o = E : o === pe || o === me ? o = T : (o = E, i = void 0);
		let d = o === E && e[t + 1].startsWith("/>") ? " " : "";
		a += o === T ? n + de : l >= 0 ? (r.push(s), n.slice(0, l) + ue + n.slice(l) + v + d) : n + v + (l === -2 ? t : d);
	}
	return [be(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, M = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = xe(t, n);
		if (this.el = e.createElement(l, r), j.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = j.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ue)) {
					let t = u[o++], n = i.getAttribute(e).split(v), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Ce : r[1] === "?" ? we : r[1] === "@" ? Te : F
					}), i.removeAttribute(e);
				} else e.startsWith(v) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (_e.test(i.tagName)) {
					let e = i.textContent.split(v), t = e.length - 1;
					if (t > 0) {
						i.textContent = _ ? _.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], x()), j.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], x());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === y) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(v, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += v.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = b.createElement("template");
		return n.innerHTML = e, n;
	}
};
function N(e, t, n = e, r) {
	if (t === k) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = S(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = N(e, i._$AS(e, t.values), i, r)), t;
}
var Se = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? b).importNode(t, !0);
		j.currentNode = r;
		let i = j.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new P(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ee(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = j.nextNode(), a++);
		}
		return j.currentNode = b, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, P = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = N(this, e, t), S(e) ? e === A || e == null || e === "" ? (this._$AH !== A && this._$AR(), this._$AH = A) : e !== this._$AH && e !== k && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? fe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== A && S(this._$AH) ? this._$AA.nextSibling.data = e : this.T(b.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = M.createElement(be(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Se(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = ye.get(e.strings);
		return t === void 0 && ye.set(e.strings, t = new M(e)), t;
	}
	k(t) {
		C(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(x()), this.O(x()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ce(e).nextSibling;
			ce(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, F = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = A, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = A;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = N(this, e, t, 0), a = !S(e) || e !== this._$AH && e !== k, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = N(this, r[n + o], t, o), s === k && (s = this._$AH[o]), a ||= !S(s) || s !== this._$AH[o], s === A ? e = A : e !== A && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Ce = class extends F {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === A ? void 0 : e;
	}
}, we = class extends F {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== A);
	}
}, Te = class extends F {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = N(this, e, t, 0) ?? A) === k) return;
		let n = this._$AH, r = e === A && n !== A || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== A && (n === A || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Ee = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		N(this, e);
	}
}, De = {
	M: ue,
	P: v,
	A: y,
	C: 1,
	L: xe,
	R: Se,
	D: fe,
	V: N,
	I: P,
	H: F,
	N: we,
	U: Te,
	B: Ce,
	F: Ee
}, Oe = se.litHtmlPolyfillSupport;
Oe?.(M, P), (se.litHtmlVersions ??= []).push("3.3.3");
var ke = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new P(t.insertBefore(x(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, I = globalThis, L = class extends g {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ke(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return k;
	}
};
L._$litElement$ = !0, L.finalized = !0, I.litElementHydrateSupport?.({ LitElement: L });
var Ae = I.litElementPolyfillSupport;
Ae?.({ LitElement: L }), (I.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
var je = {
	attribute: !0,
	type: String,
	converter: m,
	reflect: !1,
	hasChanged: h
}, Me = (e = je, t, n) => {
	let { kind: r, metadata: i } = n, a = globalThis.litPropertyMetadata.get(i);
	if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(n.name, e), r === "accessor") {
		let { name: r } = n;
		return {
			set(n) {
				let i = t.get.call(this);
				t.set.call(this, n), this.requestUpdate(r, i, e, !0, n);
			},
			init(t) {
				return t !== void 0 && this.C(r, void 0, e, t), t;
			}
		};
	}
	if (r === "setter") {
		let { name: r } = n;
		return function(n) {
			let i = this[r];
			t.call(this, n), this.requestUpdate(r, i, e, !0, n);
		};
	}
	throw Error("Unsupported decorator location: " + r);
};
function Ne(e) {
	return (t, n) => typeof n == "object" ? Me(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function R(e) {
	return Ne({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/lit-html/directive.js
var Pe = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Fe = class {
	constructor(e) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(e, t, n) {
		this._$Ct = e, this._$AM = t, this._$Ci = n;
	}
	_$AS(e, t) {
		return this.update(e, t);
	}
	update(e, t) {
		return this.render(...t);
	}
}, { I: Ie } = De, Le = {}, Re = (e, t = Le) => e._$AH = t, ze = Pe(class extends Fe {
	constructor() {
		super(...arguments), this.key = A;
	}
	render(e, t) {
		return this.key = e, t;
	}
	update(e, [t, n]) {
		return t !== this.key && (Re(e), this.key = t), n;
	}
}), Be = [
	"temperature_2m",
	"apparent_temperature",
	"relative_humidity_2m",
	"precipitation_probability",
	"precipitation",
	"wind_speed_10m",
	"wind_direction_10m",
	"weather_code",
	"is_day"
], Ve = [
	"temperature_2m_max",
	"temperature_2m_min",
	"weather_code",
	"precipitation_probability_max",
	"sunrise",
	"sunset"
];
function He(e, t) {
	let n = t.model === "gfs_seamless" ? "/api/om/v1/gfs" : "/api/om/v1/forecast", r = new URL(n, e), i = Math.min(48, Math.max(2, t.hourly_count + 2)), a = Math.max(1, t.show_daily ? t.daily_count : 1), o = {
		models: t.model,
		latitude: String(t.latitude),
		longitude: String(t.longitude),
		hourly: Be.join(","),
		daily: Ve.join(","),
		timezone: "auto",
		timeformat: "unixtime",
		forecast_hours: String(i),
		forecast_days: String(a),
		temperature_unit: t.temperature_unit,
		wind_speed_unit: t.wind_speed_unit,
		precipitation_unit: t.precipitation_unit
	};
	for (let [e, t] of Object.entries(o)) r.searchParams.set(e, t);
	return r.toString();
}
function z(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function B(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function Ue(e, t, n, r) {
	let i = e[t];
	return i === void 0 ? Array(n).fill(null) : Array.isArray(i) ? i.length === n ? i : (r.push(`${t} has ${i.length} values, expected ${n}`), Array(n).fill(null)) : (r.push(`${t} is not an array`), Array(n).fill(null));
}
var We = { "mp/h": "mph" };
function V(e, t, n) {
	if (z(e) && typeof e[t] == "string") {
		let n = e[t];
		return We[n] ?? n;
	}
	return n;
}
var H = class extends Error {};
function Ge(e, t) {
	if (!z(e)) throw new H("response is not an object");
	let n = [], r = z(e.hourly) ? e.hourly : void 0, i = z(e.daily) ? e.daily : void 0;
	if (!r || !Array.isArray(r.time)) throw new H("response has no hourly.time array");
	let a = r.time, o = Object.fromEntries(Be.map((e) => [e, Ue(r, e, a.length, n)])), s = [];
	for (let [e, t] of a.entries()) {
		let r = B(t);
		if (r === null) {
			n.push(`hourly.time[${e}] is not a number`);
			continue;
		}
		let i = B(o.is_day[e]);
		s.push({
			time: r,
			temperature: B(o.temperature_2m[e]),
			apparentTemperature: B(o.apparent_temperature[e]),
			humidity: B(o.relative_humidity_2m[e]),
			precipitationProbability: B(o.precipitation_probability[e]),
			precipitation: B(o.precipitation[e]),
			windSpeed: B(o.wind_speed_10m[e]),
			windBearing: B(o.wind_direction_10m[e]),
			weatherCode: B(o.weather_code[e]),
			isDay: i === null ? null : i === 1
		});
	}
	let c = [];
	if (i && Array.isArray(i.time)) {
		let e = i.time, t = Object.fromEntries(Ve.map((t) => [t, Ue(i, t, e.length, n)]));
		for (let [r, i] of e.entries()) {
			let e = B(i);
			if (e === null) {
				n.push(`daily.time[${r}] is not a number`);
				continue;
			}
			c.push({
				time: e,
				temperatureMax: B(t.temperature_2m_max[r]),
				temperatureMin: B(t.temperature_2m_min[r]),
				weatherCode: B(t.weather_code[r]),
				precipitationProbabilityMax: B(t.precipitation_probability_max[r]),
				sunrise: B(t.sunrise[r]),
				sunset: B(t.sunset[r])
			});
		}
	}
	if (s.length === 0) throw new H(`no usable hourly data: ${n.join("; ")}`);
	return {
		hourly: s,
		daily: c,
		units: {
			temperature: V(e.hourly_units, "temperature_2m", ""),
			windSpeed: V(e.hourly_units, "wind_speed_10m", ""),
			precipitation: V(e.hourly_units, "precipitation", "")
		},
		timezone: typeof e.timezone == "string" ? e.timezone : "UTC",
		utcOffsetSeconds: B(e.utc_offset_seconds) ?? 0,
		gridLatitude: B(e.latitude) ?? NaN,
		gridLongitude: B(e.longitude) ?? NaN,
		model: t
	};
}
function Ke(e, t) {
	return e.findIndex((e) => e.time + 3600 > t);
}
function qe(e, t, n) {
	let r = Ke(e.hourly, t);
	return r < 0 ? {
		current: null,
		upcoming: [],
		expired: !0
	} : {
		current: e.hourly[r] ?? null,
		upcoming: e.hourly.slice(r + 1, r + 1 + n),
		expired: !1
	};
}
function Je(e) {
	let t = null;
	for (let n of e) n.precipitationProbability !== null && (t = t === null ? n.precipitationProbability : Math.max(t, n.precipitationProbability));
	return t;
}
var Ye = 1e3, Xe = class extends Error {
	constructor(e, t) {
		super(e), this.attempts = t;
	}
}, Ze = (e) => new Promise((t) => setTimeout(t, e));
async function Qe(e, t = {}) {
	let n = t.fetch ?? ((e, t) => globalThis.fetch(e, t)), r = t.sleep ?? Ze, i = t.timeoutMs ?? 3e4, a = [];
	for (let [t, o] of e.hosts.entries()) {
		t > 0 && await r(Ye * t);
		let s = He(o, e), c = new AbortController(), l = setTimeout(() => c.abort(), i);
		try {
			let t = await n(s, {
				signal: c.signal,
				headers: { accept: "application/json" },
				cache: "no-store"
			});
			if (!t.ok) {
				a.push(`${o}: HTTP ${t.status}`);
				continue;
			}
			let r;
			try {
				r = await t.json();
			} catch (e) {
				a.push(`${o}: invalid JSON (${e.message})`);
				continue;
			}
			return Ge(r, e.model);
		} catch (e) {
			let t = c.signal.aborted ? "timeout" : e.message;
			a.push(`${o}: ${t}`);
		} finally {
			clearTimeout(l);
		}
	}
	throw new Xe("forecast unavailable from every host", a);
}
//#endregion
//#region src/types.ts
var $e = {
	metro: 9,
	state: 5.79
}, U = ["https://data2.weatherwise.app", "https://data1.weatherwise.app"], et = "https://web.weatherwise.app", tt = /* @__PURE__ */ new Set(/* @__PURE__ */ "type.title.latitude.longitude.view.zoom.map_mode.show_map.map_height.map_reload_minutes.map_interactive.show_conditions.show_hourly.hourly_count.show_daily.daily_count.model.temperature_unit.wind_speed_unit.precipitation_unit.refresh_minutes.hosts.view_layout.layout_options.grid_options.visibility".split(".")), nt = /* @__PURE__ */ new Set(["metro", "state"]), rt = /* @__PURE__ */ new Set(["ecmwf_ifs025", "gfs_seamless"]), it = /* @__PURE__ */ new Set(["fahrenheit", "celsius"]), at = /* @__PURE__ */ new Set([
	"mph",
	"kmh",
	"ms",
	"kn"
]), ot = /* @__PURE__ */ new Set(["mm", "inch"]), st = /^[A-Z0-9_-]{1,32}$/;
function ct(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function W(e, t, n, r) {
	let i = e[t];
	return i === void 0 ? (r.required && n.push(`${t}: required`), r.fallback) : typeof i != "number" || !Number.isFinite(i) ? (n.push(`${t}: must be a number`), r.fallback) : r.integer && !Number.isInteger(i) ? (n.push(`${t}: must be a whole number`), r.fallback) : r.min !== void 0 && i < r.min ? (n.push(`${t}: must be at least ${r.min}`), r.fallback) : r.max !== void 0 && i > r.max ? (n.push(`${t}: must be at most ${r.max}`), r.fallback) : i;
}
function G(e, t, n, r) {
	let i = e[t];
	return i === void 0 ? r : typeof i == "boolean" ? i : (n.push(`${t}: must be true or false`), r);
}
function K(e, t, n, r, i) {
	let a = e[t];
	return a === void 0 ? i : typeof a != "string" || !n.has(a) ? (r.push(`${t}: must be one of ${[...n].join(", ")}`), i) : a;
}
function lt(e, t) {
	let n = e.hosts;
	if (n === void 0) return [...U];
	if (!Array.isArray(n) || n.length === 0) return t.push("hosts: must be a non-empty list of https origins"), [...U];
	let r = [];
	for (let [e, i] of n.entries()) {
		if (typeof i != "string") {
			t.push(`hosts[${e}]: must be a string`);
			continue;
		}
		let n;
		try {
			n = new URL(i);
		} catch {
			t.push(`hosts[${e}]: "${i}" is not a URL`);
			continue;
		}
		if (n.protocol !== "https:" || n.pathname !== "/" || n.search || n.hash) {
			t.push(`hosts[${e}]: must be a bare https origin such as https://data2.weatherwise.app`);
			continue;
		}
		r.push(n.origin);
	}
	return r.length > 0 ? r : [...U];
}
function ut(e) {
	let t = [];
	if (!ct(e)) return { errors: ["configuration must be a mapping"] };
	for (let n of Object.keys(e)) tt.has(n) || t.push(`${n}: unknown option`);
	e.title !== void 0 && typeof e.title != "string" && t.push("title: must be a string");
	let n = W(e, "latitude", t, {
		min: -90,
		max: 90,
		required: !0
	}), r = W(e, "longitude", t, {
		min: -180,
		max: 180,
		required: !0
	}), i = K(e, "view", nt, t, "metro"), a = W(e, "zoom", t, {
		min: 1,
		max: 18,
		fallback: $e[i]
	}), o = "RADAR";
	e.map_mode !== void 0 && (typeof e.map_mode != "string" || !st.test(e.map_mode) ? t.push("map_mode: must be an upper-case token such as RADAR") : o = e.map_mode);
	let s = {
		title: typeof e.title == "string" ? e.title : void 0,
		latitude: n ?? 0,
		longitude: r ?? 0,
		view: i,
		zoom: a ?? $e[i],
		map_mode: o,
		show_map: G(e, "show_map", t, !0),
		map_height: W(e, "map_height", t, {
			min: 120,
			max: 4e3,
			integer: !0,
			fallback: 480
		}) ?? 480,
		map_reload_minutes: W(e, "map_reload_minutes", t, {
			min: 0,
			max: 1440,
			integer: !0,
			fallback: 0
		}) ?? 0,
		map_interactive: G(e, "map_interactive", t, !1),
		show_conditions: G(e, "show_conditions", t, !0),
		show_hourly: G(e, "show_hourly", t, !0),
		hourly_count: W(e, "hourly_count", t, {
			min: 1,
			max: 48,
			integer: !0,
			fallback: 12
		}) ?? 12,
		show_daily: G(e, "show_daily", t, !1),
		daily_count: W(e, "daily_count", t, {
			min: 1,
			max: 16,
			integer: !0,
			fallback: 5
		}) ?? 5,
		model: K(e, "model", rt, t, "ecmwf_ifs025"),
		temperature_unit: K(e, "temperature_unit", it, t, "fahrenheit"),
		wind_speed_unit: K(e, "wind_speed_unit", at, t, "mph"),
		precipitation_unit: K(e, "precipitation_unit", ot, t, "inch"),
		refresh_minutes: W(e, "refresh_minutes", t, {
			min: 10,
			max: 1440,
			integer: !0,
			fallback: 30
		}) ?? 30,
		hosts: lt(e, t)
	};
	return t.length > 0 ? { errors: t } : {
		config: s,
		errors: t
	};
}
function dt(e) {
	return e.show_conditions || e.show_hourly || e.show_daily;
}
//#endregion
//#region src/conditions.ts
var ft = {
	"clear-day": "Clear",
	"clear-night": "Clear",
	"partly-cloudy-day": "Partly cloudy",
	"partly-cloudy-night": "Partly cloudy",
	cloudy: "Cloudy",
	fog: "Fog",
	rain: "Rain",
	pouring: "Heavy rain",
	sleet: "Freezing rain",
	snow: "Snow",
	thunderstorm: "Thunderstorm",
	hail: "Thunderstorm with hail",
	unknown: "Unknown"
};
function q(e, t) {
	let n = t !== !1, r;
	switch (e) {
		case 0:
			r = n ? "clear-day" : "clear-night";
			break;
		case 1:
		case 2:
			r = n ? "partly-cloudy-day" : "partly-cloudy-night";
			break;
		case 3:
			r = "cloudy";
			break;
		case 45:
		case 48:
			r = "fog";
			break;
		case 51:
		case 53:
		case 55:
		case 61:
		case 63:
		case 80:
		case 81:
			r = "rain";
			break;
		case 65:
		case 82:
			r = "pouring";
			break;
		case 56:
		case 57:
		case 66:
		case 67:
			r = "sleet";
			break;
		case 71:
		case 73:
		case 75:
		case 77:
		case 85:
		case 86:
			r = "snow";
			break;
		case 95:
			r = "thunderstorm";
			break;
		case 96:
		case 99:
			r = "hail";
			break;
		default: r = "unknown";
	}
	return {
		key: r,
		label: ft[r]
	};
}
function pt(e) {
	return e === null || !Number.isFinite(e) ? "" : [
		"N",
		"NE",
		"E",
		"SE",
		"S",
		"SW",
		"W",
		"NW"
	][Math.round((e % 360 + 360) % 360 / 45) % 8] ?? "";
}
//#endregion
//#region src/editor-form.ts
var J = (e) => ({
	name: "",
	type: "grid",
	flatten: !0,
	schema: e
}), mt = [
	{
		name: "title",
		selector: { text: {} }
	},
	J([{
		name: "latitude",
		required: !0,
		selector: { number: {
			min: -90,
			max: 90,
			step: "any",
			mode: "box"
		} }
	}, {
		name: "longitude",
		required: !0,
		selector: { number: {
			min: -180,
			max: 180,
			step: "any",
			mode: "box"
		} }
	}]),
	J([{
		name: "view",
		selector: { select: {
			mode: "dropdown",
			options: [{
				value: "metro",
				label: "Metro area (zoom 9)"
			}, {
				value: "state",
				label: "State (zoom 5.79)"
			}]
		} }
	}, {
		name: "zoom",
		selector: { number: {
			min: 1,
			max: 18,
			step: .01,
			mode: "box"
		} }
	}]),
	{
		name: "",
		type: "expandable",
		flatten: !0,
		title: "Map",
		schema: [J([
			{
				name: "show_map",
				selector: { boolean: {} }
			},
			{
				name: "map_interactive",
				selector: { boolean: {} }
			},
			{
				name: "map_mode",
				selector: { text: {} }
			}
		]), J([{
			name: "map_height",
			selector: { number: {
				min: 120,
				max: 4e3,
				mode: "box",
				unit_of_measurement: "px"
			} }
		}, {
			name: "map_reload_minutes",
			selector: { number: {
				min: 0,
				max: 1440,
				mode: "box",
				unit_of_measurement: "min"
			} }
		}])]
	},
	{
		name: "",
		type: "expandable",
		flatten: !0,
		title: "Forecast",
		schema: [
			J([
				{
					name: "show_conditions",
					selector: { boolean: {} }
				},
				{
					name: "show_hourly",
					selector: { boolean: {} }
				},
				{
					name: "show_daily",
					selector: { boolean: {} }
				}
			]),
			J([
				{
					name: "hourly_count",
					selector: { number: {
						min: 1,
						max: 48,
						mode: "box"
					} }
				},
				{
					name: "daily_count",
					selector: { number: {
						min: 1,
						max: 16,
						mode: "box"
					} }
				},
				{
					name: "refresh_minutes",
					selector: { number: {
						min: 10,
						max: 1440,
						mode: "box",
						unit_of_measurement: "min"
					} }
				}
			]),
			J([
				{
					name: "model",
					selector: { select: {
						mode: "dropdown",
						options: [{
							value: "ecmwf_ifs025",
							label: "ECMWF IFS 0.25"
						}, {
							value: "gfs_seamless",
							label: "GFS seamless"
						}]
					} }
				},
				{
					name: "temperature_unit",
					selector: { select: {
						mode: "dropdown",
						options: ["fahrenheit", "celsius"]
					} }
				},
				{
					name: "wind_speed_unit",
					selector: { select: {
						mode: "dropdown",
						options: [
							"mph",
							"kmh",
							"ms",
							"kn"
						]
					} }
				},
				{
					name: "precipitation_unit",
					selector: { select: {
						mode: "dropdown",
						options: ["inch", "mm"]
					} }
				}
			])
		]
	}
], ht = {
	title: "Title",
	latitude: "Latitude",
	longitude: "Longitude",
	view: "View preset",
	zoom: "Zoom (overrides the preset)",
	show_map: "Show the WeatherWise map",
	map_interactive: "Allow touch, mouse, and wheel input on the map",
	map_mode: "Map mode",
	map_height: "Map height",
	map_reload_minutes: "Reload the map every",
	show_conditions: "Show modeled conditions headline",
	show_hourly: "Show hourly strip",
	show_daily: "Show daily strip",
	hourly_count: "Hours to show",
	daily_count: "Days to show",
	refresh_minutes: "Forecast refresh interval",
	model: "Forecast model",
	temperature_unit: "Temperature unit",
	wind_speed_unit: "Wind speed unit",
	precipitation_unit: "Precipitation unit"
}, gt = {
	view: "Metro centers tightly on the point; State pulls back to the whole state. Set zoom to override.",
	map_interactive: "Off by default for display boards: a stray touch or wheel event would otherwise pan or zoom the map away until the next reload.",
	map_mode: "Upper-case token from the WeatherWise URL, RADAR by default. Other modes are unverified.",
	map_reload_minutes: "0 never reloads. A periodic reload guards a kiosk against a stuck embedded page.",
	refresh_minutes: "Minimum 10 minutes. Forecast data is modeled, not measured; it changes on model runs, not by the minute."
};
function _t() {
	return {
		schema: mt,
		computeLabel: (e) => ht[e.name],
		computeHelper: (e) => gt[e.name]
	};
}
//#endregion
//#region src/format.ts
function vt(e, t, n) {
	try {
		return new Intl.DateTimeFormat(n, {
			hour: "numeric",
			timeZone: t
		}).format(/* @__PURE__ */ new Date(e * 1e3));
	} catch {
		return (/* @__PURE__ */ new Date(e * 1e3)).toISOString().slice(11, 16);
	}
}
function yt(e, t, n) {
	try {
		return new Intl.DateTimeFormat(n, {
			hour: "numeric",
			minute: "2-digit",
			timeZone: t
		}).format(/* @__PURE__ */ new Date(e * 1e3));
	} catch {
		return (/* @__PURE__ */ new Date(e * 1e3)).toISOString().slice(11, 16);
	}
}
function bt(e, t, n) {
	try {
		return new Intl.DateTimeFormat(n, {
			weekday: "short",
			timeZone: t
		}).format(/* @__PURE__ */ new Date(e * 1e3));
	} catch {
		return (/* @__PURE__ */ new Date(e * 1e3)).toISOString().slice(0, 10);
	}
}
function xt(e) {
	let t = Math.round(e / 6e4);
	return t < 1 ? "just now" : t < 60 ? `${t} min ago` : `${Math.floor(t / 60)} h ${t % 60} min ago`;
}
function Y(e, t = 0) {
	return e === null || !Number.isFinite(e) ? "--" : e.toFixed(t);
}
//#endregion
//#region src/icons.ts
var St = O`<circle cx="12" cy="12" r="4" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="4.5"/><line x1="12" y1="19.5" x2="12" y2="22"/><line x1="2" y1="12" x2="4.5" y2="12"/><line x1="19.5" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="6.7" y2="6.7"/><line x1="17.3" y1="17.3" x2="19.1" y2="19.1"/><line x1="4.9" y1="19.1" x2="6.7" y2="17.3"/><line x1="17.3" y1="6.7" x2="19.1" y2="4.9"/></g>`, Ct = O`<path fill="currentColor" d="M14.5 2.5a9.5 9.5 0 1 0 7 15.6A8 8 0 0 1 14.5 2.5z"/>`, wt = O`<path fill="currentColor" d="M6.5 19a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 17.6 9.1 4 4 0 0 1 17.5 19H6.5z"/>`, Tt = O`<path fill="currentColor" d="M9 20a3.5 3.5 0 0 1-.5-6.96A5 5 0 0 1 18.2 12 3.2 3.2 0 0 1 18 20H9z"/>`, Et = (e) => O`<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="${e}" x2="7" y2="${e + 3}"/><line x1="12" y1="${e}" x2="11" y2="${e + 3}"/><line x1="16" y1="${e}" x2="15" y2="${e + 3}"/></g>`, X = O`<path fill="currentColor" d="M6.5 15a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 16.6 6 3.6 3.6 0 0 1 17.2 15H6.5z"/>`, Dt = {
	"clear-day": St,
	"clear-night": Ct,
	"partly-cloudy-day": O`<g transform="translate(-3 -3) scale(0.8)">${St}</g>${Tt}`,
	"partly-cloudy-night": O`<g transform="translate(-2 -3) scale(0.7)">${Ct}</g>${Tt}`,
	cloudy: wt,
	fog: O`${X}<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="18" x2="19" y2="18"/><line x1="7" y1="21.5" x2="17" y2="21.5"/></g>`,
	rain: O`${X}${Et(18)}`,
	pouring: O`${X}${Et(17)}<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="10" y1="21" x2="9.5" y2="23"/><line x1="14" y1="21" x2="13.5" y2="23"/></g>`,
	sleet: O`${X}<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="18" x2="7" y2="21"/><line x1="16" y1="18" x2="15" y2="21"/></g><circle cx="12" cy="20" r="1.5" fill="currentColor"/>`,
	snow: O`${X}<g fill="currentColor"><circle cx="8" cy="19" r="1.5"/><circle cx="12" cy="21.5" r="1.5"/><circle cx="16" cy="19" r="1.5"/></g>`,
	thunderstorm: O`${X}<path fill="currentColor" d="M12.5 15.5 9.5 20h2.5l-1 3.5 3.5-5h-2.5z"/>`,
	hail: O`${X}<path fill="currentColor" d="M11 15.5 8.5 19.5h2l-.8 3 3-4.5h-2z"/><circle cx="16" cy="19.5" r="1.6" fill="currentColor"/>`,
	unknown: O`<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><text x="12" y="16.5" text-anchor="middle" font-size="12" fill="currentColor">?</text>`
};
function Ot(e, t = 24) {
	return O`<svg viewBox="0 0 24 24" width="${t}" height="${t}" aria-hidden="true">${Dt[e]}</svg>`;
}
//#endregion
//#region src/map-url.ts
function kt(e, t) {
	return Number(e.toFixed(t)).toString();
}
function At(e) {
	return `${et}/#${`map=${kt(e.zoom, 2)}/${kt(e.latitude, 4)}/${kt(e.longitude, 4)}&m=${e.map_mode}`}`;
}
//#endregion
//#region src/styles.ts
var jt = o`
  :host {
    --wwc-bg: var(--ha-card-background, var(--card-background-color, #14161c));
    --wwc-text: var(--primary-text-color, #e9e9ee);
    --wwc-text-dim: var(--secondary-text-color, #9a9aa3);
    --wwc-tile: rgba(127, 127, 127, 0.14);
    --wwc-divider: var(--divider-color, rgba(127, 127, 127, 0.3));
    --wwc-accent: var(--primary-color, #38bdf8);
    --wwc-warn: var(--warning-color, #f59e0b);
    --wwc-error: var(--error-color, #ef4444);
    --wwc-radius: var(--ha-card-border-radius, 12px);
  }
`;
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/decorate.js
function Z(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/weatherwise-card.ts
var Mt, Q = 6e4, Nt = 2, $ = class extends L {
	constructor(...e) {
		super(...e), this.loading = !1, this.now = Date.now(), this.mapGeneration = 0, this.forecastKey = "";
	}
	setConfig(e) {
		let t = ut(e);
		if (!t.config) throw Error(`weatherwise-card configuration:\n- ${t.errors.join("\n- ")}`);
		this.config = t.config, this.mapGeneration += 1, this.arm();
	}
	set hass(e) {
		this._hass = e;
	}
	getCardSize() {
		let e = this.config;
		if (!e) return 4;
		let t = 1;
		return e.show_conditions && (t += 2), e.show_map && (t += Math.ceil(e.map_height / 50)), e.show_hourly && (t += 2), e.show_daily && (t += 2), t;
	}
	getGridOptions() {
		return {
			columns: "full",
			min_columns: 6
		};
	}
	static getConfigForm() {
		return _t();
	}
	static getStubConfig() {
		return {
			latitude: 32.391,
			longitude: -96.7,
			view: "metro"
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.arm();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.disarm();
	}
	arm() {
		if (this.disarm(), this.config && this.isConnected) {
			if (this.tickTimer = setInterval(() => {
				this.now = Date.now();
			}, Q), dt(this.config)) {
				let e = JSON.stringify([
					this.config.latitude,
					this.config.longitude,
					this.config.model,
					this.config.temperature_unit,
					this.config.wind_speed_unit,
					this.config.precipitation_unit,
					this.config.hourly_count,
					this.config.show_daily ? this.config.daily_count : 0,
					this.config.hosts
				]);
				e !== this.forecastKey && (this.forecastKey = e, this.forecast = void 0, this.fetchedAt = void 0, this.lastError = void 0), this.refresh(), this.pollTimer = setInterval(() => void this.refresh(), this.config.refresh_minutes * Q);
			}
			this.config.show_map && this.config.map_reload_minutes > 0 && (this.mapTimer = setInterval(() => {
				this.mapGeneration += 1;
			}, this.config.map_reload_minutes * Q));
		}
	}
	disarm() {
		for (let e of [
			this.pollTimer,
			this.tickTimer,
			this.mapTimer
		]) e !== void 0 && clearInterval(e);
		this.pollTimer = this.tickTimer = this.mapTimer = void 0;
	}
	async refresh() {
		if (!this.config || this.loading) return;
		this.loading = !0;
		let e = this.forecastKey;
		try {
			let t = await Qe(this.config);
			if (e !== this.forecastKey) return;
			this.forecast = t, this.fetchedAt = Date.now(), this.lastError = void 0;
		} catch (t) {
			if (e !== this.forecastKey) return;
			this.lastError = t instanceof Xe ? t.attempts.join("; ") : t.message;
		} finally {
			this.loading = !1, this.now = Date.now();
		}
	}
	locale() {
		return this._hass?.locale?.language ?? this._hass?.language;
	}
	render() {
		let e = this.config;
		return e ? D`
      <div class="card">
        ${this.renderHeader(e)}
        ${e.show_map ? this.renderMap(e) : A}
        ${e.show_hourly ? this.renderHourly(e) : A}
        ${e.show_daily ? this.renderDaily(e) : A}
        ${this.renderFooter(e)}
      </div>
    ` : D`<div class="card"><div class="problems">No configuration</div></div>`;
	}
	renderHeader(e) {
		return D`
      <div class="header">
        <div class="title">${e.title ?? (e.view === "state" ? "State radar" : "Metro radar")}</div>
        ${e.show_conditions ? this.renderHeadline(e) : A}
      </div>
    `;
	}
	renderHeadline(e) {
		let t = this.forecast;
		if (!t) return D`<div class="meta">
        ${this.lastError ? D`<span class="badge error">unavailable</span><span>${this.lastError}</span>` : D`<span>Loading forecast</span>`}
      </div>`;
		let n = qe(t, Math.floor(this.now / 1e3), e.hourly_count), r = n.current;
		if (!r) return D`<div class="meta"><span class="badge stale">expired</span><span>Forecast window has passed; waiting for refresh</span></div>`;
		let i = q(r.weatherCode, r.isDay), a = this.locale(), o = Je([r, ...n.upcoming]);
		return D`
      <div class="headline">
        <span class="icon" title=${i.label}>${Ot(i.key, 44)}</span>
        <span class="temp">${Y(r.temperature)}${t.units.temperature}</span>
        <div class="details">
          <span>${i.label}</span>
          <span>Feels <b>${Y(r.apparentTemperature)}${t.units.temperature}</b></span>
          <span>Rain <b>${Y(r.precipitationProbability)}%</b>${o !== null && o !== r.precipitationProbability ? D` (max ${Y(o)}%)` : A}</span>
          <span>Wind <b>${Y(r.windSpeed)} ${t.units.windSpeed}</b> ${pt(r.windBearing)}</span>
          <span>Humidity <b>${Y(r.humidity)}%</b></span>
          <span>Valid <b>${vt(r.time, t.timezone, a)}</b></span>
        </div>
      </div>
      ${this.renderStatus(e)}
    `;
	}
	renderStatus(e) {
		let t = [];
		if (this.fetchedAt !== void 0) {
			let n = this.now - this.fetchedAt;
			n > e.refresh_minutes * Q * Nt && t.push(D`<span class="badge stale">stale</span>`), t.push(D`<span>fetched ${xt(n)}</span>`);
		}
		return this.lastError && t.push(D`<span class="badge error">refresh failed</span><span>${this.lastError}</span>`), D`<div class="meta">${t}</div>`;
	}
	renderMap(e) {
		let t = At(e);
		return D`
      <div class="map ${e.map_interactive ? "" : "locked"}" style="height:${e.map_height}px">
        ${ze(this.mapGeneration, D`<iframe
            src=${t}
            title="WeatherWise map"
            referrerpolicy="no-referrer"
            allow=""
            loading="eager"
          ></iframe>`)}
      </div>
    `;
	}
	renderHourly(e) {
		let t = this.forecast;
		if (!t) return A;
		let n = qe(t, Math.floor(this.now / 1e3), e.hourly_count);
		if (n.upcoming.length === 0) return A;
		let r = this.locale();
		return D`<div class="strip">
      ${n.upcoming.map((e) => {
			let n = q(e.weatherCode, e.isDay);
			return D`<div class="tile">
          <span class="when">${vt(e.time, t.timezone, r)}</span>
          <span class="icon" title=${n.label}>${Ot(n.key, 26)}</span>
          <span>${Y(e.temperature)}${t.units.temperature}</span>
          <span class="rain">${Y(e.precipitationProbability)}%</span>
        </div>`;
		})}
    </div>`;
	}
	renderDaily(e) {
		let t = this.forecast;
		if (!t || t.daily.length === 0) return A;
		let n = this.locale();
		return D`<div class="strip">
      ${t.daily.slice(0, e.daily_count).map((e) => {
			let r = q(e.weatherCode, !0);
			return D`<div class="tile">
          <span class="when">${bt(e.time, t.timezone, n)}</span>
          <span class="icon" title=${r.label}>${Ot(r.key, 26)}</span>
          <span>${Y(e.temperatureMax)}${t.units.temperature} <span class="lo">${Y(e.temperatureMin)}${t.units.temperature}</span></span>
          <span class="rain">${Y(e.precipitationProbabilityMax)}%</span>
        </div>`;
		})}
    </div>`;
	}
	renderFooter(e) {
		let t = this.forecast, n = t?.daily[0], r = this.locale();
		return D`<div class="footer">
      <span>
        <a href=${At(e)} target="_blank" rel="noopener noreferrer">WeatherWise</a>
        ${t ? D` · ${t.model === "gfs_seamless" ? "GFS" : "ECMWF"} model, grid ${Y(t.gridLatitude, 2)}, ${Y(t.gridLongitude, 2)}` : A}
      </span>
      ${n && n.sunrise !== null && n.sunset !== null && t ? D`<span>Sunrise ${yt(n.sunrise, t.timezone, r)} · Sunset ${yt(n.sunset, t.timezone, r)}</span>` : A}
    </div>`;
	}
};
Mt = $, Mt.styles = [jt, o`
      :host {
        display: block;
      }
      .card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: var(--wwc-bg);
        border-radius: var(--wwc-radius);
        padding: 16px;
        color: var(--wwc-text);
        box-sizing: border-box;
      }
      .header {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }
      .title {
        font-size: 18px;
        font-weight: 600;
        flex: 1 1 auto;
        min-width: 0;
      }
      .headline {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .headline .icon {
        color: var(--wwc-accent);
        display: inline-flex;
      }
      .temp {
        font-size: 40px;
        font-weight: 300;
        line-height: 1;
      }
      .details {
        display: grid;
        grid-template-columns: auto auto;
        gap: 2px 12px;
        font-size: 13px;
        color: var(--wwc-text-dim);
      }
      .details b {
        color: var(--wwc-text);
        font-weight: 500;
      }
      .meta {
        font-size: 12px;
        color: var(--wwc-text-dim);
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        align-items: center;
      }
      .badge {
        border-radius: 6px;
        padding: 1px 8px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .badge.stale {
        background: var(--wwc-warn);
        color: #111;
      }
      .badge.error {
        background: var(--wwc-error);
        color: #fff;
      }
      .map {
        position: relative;
        width: 100%;
        border-radius: calc(var(--wwc-radius) - 4px);
        overflow: hidden;
        background: #0b1020;
      }
      .map iframe {
        display: block;
        width: 100%;
        height: 100%;
        border: 0;
      }
      .map.locked iframe {
        pointer-events: none;
      }
      .strip {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .strip::-webkit-scrollbar {
        display: none;
      }
      .tile {
        flex: 1 0 64px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        background: var(--wwc-tile);
        border-radius: 10px;
        padding: 8px 6px;
        font-size: 13px;
      }
      .tile .when {
        color: var(--wwc-text-dim);
        font-size: 12px;
      }
      .tile .icon {
        color: var(--wwc-accent);
        display: inline-flex;
      }
      .tile .rain {
        color: var(--wwc-text-dim);
        font-size: 12px;
      }
      .tile .lo {
        color: var(--wwc-text-dim);
      }
      .footer {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        font-size: 11px;
        color: var(--wwc-text-dim);
        flex-wrap: wrap;
      }
      .footer a {
        color: inherit;
      }
      .problems {
        color: var(--wwc-error);
        white-space: pre-wrap;
        font-size: 13px;
      }
    `], Z([Ne({ attribute: !1 })], $.prototype, "config", void 0), Z([R()], $.prototype, "forecast", void 0), Z([R()], $.prototype, "fetchedAt", void 0), Z([R()], $.prototype, "lastError", void 0), Z([R()], $.prototype, "loading", void 0), Z([R()], $.prototype, "now", void 0), Z([R()], $.prototype, "mapGeneration", void 0), customElements.define("weatherwise-card", $), window.customCards = window.customCards ?? [], window.customCards.push({
	type: "weatherwise-card",
	name: "WeatherWise Card",
	description: "Embedded WeatherWise radar map at metro or state zoom with a modeled-conditions headline and hourly strip. Built for kiosk displays.",
	documentationURL: "https://github.com/trooperthorn/ha_card_weatherwise"
}), console.info("%c WEATHERWISE-CARD %c v2026.09.30.1 ", "background: #444; color: #fff; border-radius: 3px 0 0 3px; padding: 2px 0;", "background: #38bdf8; color: #111; border-radius: 0 3px 3px 0; padding: 2px 0;");
//#endregion
export { $ as WeatherWiseCard };
