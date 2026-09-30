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
}, oe = (e, t) => !l(e, t), se = {
	attribute: !0,
	type: String,
	converter: m,
	reflect: !1,
	useDefault: !1,
	hasChanged: oe
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var h = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = se) {
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
		return this.elementProperties.get(e) ?? se;
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
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? oe)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
h.elementStyles = [], h.shadowRootOptions = { mode: "open" }, h[p("elementProperties")] = /* @__PURE__ */ new Map(), h[p("finalized")] = /* @__PURE__ */ new Map(), ae?.({ ReactiveElement: h }), (f.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var ce = globalThis, le = (e) => e, g = ce.trustedTypes, ue = g ? g.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, de = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, fe = "?" + _, pe = `<${fe}>`, v = document, y = () => v.createComment(""), b = (e) => e === null || typeof e != "object" && typeof e != "function", x = Array.isArray, me = (e) => x(e) || typeof e?.[Symbol.iterator] == "function", S = "[ 	\n\f\r]", C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, he = /-->/g, ge = />/g, w = RegExp(`>|${S}(?:([^\\s"'>=/]+)(${S}*=${S}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), _e = /'/g, ve = /"/g, ye = /^(?:script|style|textarea|title)$/i, be = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), T = be(1), E = be(2), D = Symbol.for("lit-noChange"), O = Symbol.for("lit-nothing"), xe = /* @__PURE__ */ new WeakMap(), k = v.createTreeWalker(v, 129);
function Se(e, t) {
	if (!x(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ue === void 0 ? t : ue.createHTML(t);
}
var Ce = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = C;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === C ? c[1] === "!--" ? o = he : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = w) : (ye.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = w) : o = ge : o === w ? c[0] === ">" ? (o = i ?? C, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? w : c[3] === "\"" ? ve : _e) : o === ve || o === _e ? o = w : o === he || o === ge ? o = C : (o = w, i = void 0);
		let d = o === w && e[t + 1].startsWith("/>") ? " " : "";
		a += o === C ? n + pe : l >= 0 ? (r.push(s), n.slice(0, l) + de + n.slice(l) + _ + d) : n + _ + (l === -2 ? t : d);
	}
	return [Se(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, A = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ce(t, n);
		if (this.el = e.createElement(l, r), k.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = k.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(de)) {
					let t = u[o++], n = i.getAttribute(e).split(_), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Te : r[1] === "?" ? Ee : r[1] === "@" ? De : N
					}), i.removeAttribute(e);
				} else e.startsWith(_) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ye.test(i.tagName)) {
					let e = i.textContent.split(_), t = e.length - 1;
					if (t > 0) {
						i.textContent = g ? g.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], y()), k.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], y());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === fe) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(_, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += _.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = v.createElement("template");
		return n.innerHTML = e, n;
	}
};
function j(e, t, n = e, r) {
	if (t === D) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = b(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = j(e, i._$AS(e, t.values), i, r)), t;
}
var we = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? v).importNode(t, !0);
		k.currentNode = r;
		let i = k.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new M(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Oe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = k.nextNode(), a++);
		}
		return k.currentNode = v, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, M = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = O, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = j(this, e, t), b(e) ? e === O || e == null || e === "" ? (this._$AH !== O && this._$AR(), this._$AH = O) : e !== this._$AH && e !== D && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? me(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== O && b(this._$AH) ? this._$AA.nextSibling.data = e : this.T(v.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = A.createElement(Se(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new we(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = xe.get(e.strings);
		return t === void 0 && xe.set(e.strings, t = new A(e)), t;
	}
	k(t) {
		x(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(y()), this.O(y()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = le(e).nextSibling;
			le(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, N = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = O, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = O;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = j(this, e, t, 0), a = !b(e) || e !== this._$AH && e !== D, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = j(this, r[n + o], t, o), s === D && (s = this._$AH[o]), a ||= !b(s) || s !== this._$AH[o], s === O ? e = O : e !== O && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === O ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Te = class extends N {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === O ? void 0 : e;
	}
}, Ee = class extends N {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== O);
	}
}, De = class extends N {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = j(this, e, t, 0) ?? O) === D) return;
		let n = this._$AH, r = e === O && n !== O || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== O && (n === O || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Oe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		j(this, e);
	}
}, ke = {
	M: de,
	P: _,
	A: fe,
	C: 1,
	L: Ce,
	R: we,
	D: me,
	V: j,
	I: M,
	H: N,
	N: Ee,
	U: De,
	B: Te,
	F: Oe
}, Ae = ce.litHtmlPolyfillSupport;
Ae?.(A, M), (ce.litHtmlVersions ??= []).push("3.3.3");
var je = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new M(t.insertBefore(y(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Me = globalThis, P = class extends h {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = je(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return D;
	}
};
P._$litElement$ = !0, P.finalized = !0, Me.litElementHydrateSupport?.({ LitElement: P });
var Ne = Me.litElementPolyfillSupport;
Ne?.({ LitElement: P }), (Me.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
var Pe = {
	attribute: !0,
	type: String,
	converter: m,
	reflect: !1,
	hasChanged: oe
}, Fe = (e = Pe, t, n) => {
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
function Ie(e) {
	return (t, n) => typeof n == "object" ? Fe(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function F(e) {
	return Ie({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/lit-html/directive.js
var Le = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Re = class {
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
}, { I: ze } = ke, Be = {}, Ve = (e, t = Be) => e._$AH = t, He = Le(class extends Re {
	constructor() {
		super(...arguments), this.key = O;
	}
	render(e, t) {
		return this.key = e, t;
	}
	update(e, [t, n]) {
		return t !== this.key && (Ve(e), this.key = t), n;
	}
}), Ue = /^[A-Z]{2}[CZ]\d{3}$/, We = /^[A-Z]{2,3}$/;
function Ge(e, t) {
	return new URL(`/warnings/${t}.geojson`, e).toString();
}
function Ke(e, t) {
	return new URL(`/warnings/archive/${t}-geometry.geojson`, e).toString();
}
function I(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function L(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function R(e) {
	return typeof e == "string" && e.trim() !== "" ? e.trim() : null;
}
function qe(e) {
	return Array.isArray(e) && e.length >= 4 && e.every((e) => Array.isArray(e) && e.length >= 2 && L(e[0]) !== null && L(e[1]) !== null);
}
function Je(e) {
	return !I(e) || !Array.isArray(e.coordinates) ? null : e.type === "Polygon" && e.coordinates.every(qe) ? {
		type: "Polygon",
		coordinates: e.coordinates
	} : e.type === "MultiPolygon" && e.coordinates.every((e) => Array.isArray(e) && e.every(qe)) ? {
		type: "MultiPolygon",
		coordinates: e.coordinates
	} : null;
}
function Ye(e) {
	return I(e) ? e.type === "Feature" ? Je(e.geometry) : Je(e) : null;
}
function Xe(e) {
	if (!Array.isArray(e) || e.length !== 4) return null;
	let t = e.map(L);
	return t.some((e) => e === null) ? null : t;
}
function Ze(e) {
	if (!I(e) || !I(e.properties)) return null;
	let t = e.properties, n = R(t.id), r = R(t.title);
	if (n === null || r === null) return null;
	let i = I(t.tags) ? t.tags : {};
	return {
		id: n,
		title: r,
		product: R(t.product) ?? "",
		significance: R(t.significance) ?? "",
		emergency: t.emergency === !0,
		office: R(t.office),
		issuedAt: L(t.issued_at_ms),
		startsAt: L(t.starts_at_ms),
		expiresAt: L(t.expires_at_ms),
		ugcs: Array.isArray(t.ugcs) ? t.ugcs.filter((e) => typeof e == "string") : [],
		bbox: Xe(t.bbox),
		what: R(i.WHAT),
		where: R(i.WHERE),
		when: R(i.WHEN),
		impacts: R(i.IMPACTS),
		geometry: Je(e.geometry)
	};
}
var Qe = class extends Error {};
function $e(e) {
	if (!I(e) || !Array.isArray(e.features)) throw new Qe("response is not a FeatureCollection");
	let t = [];
	for (let n of e.features) {
		let e = Ze(n);
		e && t.push(e);
	}
	return t;
}
function et(e, t, n) {
	let r = !1, i = n.length;
	for (let a = 0, o = i - 1; a < i; o = a, a += 1) {
		let [i, s] = n[a], [c, l] = n[o];
		s > t != l > t && e < (c - i) * (t - s) / (l - s) + i && (r = !r);
	}
	return r;
}
function tt(e, t, n) {
	let [r, ...i] = n;
	return !r || !et(e, t, r) ? !1 : !i.some((n) => et(e, t, n));
}
function nt(e, t, n) {
	return n.type === "Polygon" ? tt(e, t, n.coordinates) : n.coordinates.some((n) => tt(e, t, n));
}
function rt(e, t, n) {
	let [r, i, a, o] = e;
	return t >= r && t <= a && n >= i && n <= o;
}
function it(e, t) {
	return e.expiresAt === null || e.expiresAt > t;
}
function at(e) {
	return e.significance === "O" || e.significance === "F";
}
var ot = {
	W: 0,
	A: 1,
	Y: 2,
	S: 3,
	F: 4,
	O: 5
};
function st(e) {
	let t = ot[e.significance] ?? 6;
	return e.emergency ? -1 : t;
}
function ct(e, t) {
	let n = st(e) - st(t);
	return n === 0 ? (t.issuedAt ?? 0) - (e.issuedAt ?? 0) : n;
}
async function lt(e, t) {
	let { latitude: n, longitude: r, zones: i, nowMs: a, includeOutlooks: o, fetchGeometry: s } = t, c = new Set(i), l = [], u = [], d = e.filter((e) => it(e, a) && (o || !at(e)) && (e.bbox === null || rt(e.bbox, r, n)));
	for (let e of d) {
		if (e.ugcs.some((e) => c.has(e))) {
			l.push({
				...e,
				matchedBy: "zone"
			});
			continue;
		}
		let t = e.geometry;
		if (t === null && (t = await s(e.id)), t === null) {
			u.push(e);
			continue;
		}
		nt(r, n, t) && l.push({
			...e,
			matchedBy: "polygon"
		});
	}
	return l.sort(ct), {
		matched: l,
		unresolved: u
	};
}
//#endregion
//#region src/forecast.ts
var ut = [
	"temperature_2m",
	"apparent_temperature",
	"relative_humidity_2m",
	"precipitation_probability",
	"precipitation",
	"wind_speed_10m",
	"wind_direction_10m",
	"weather_code",
	"is_day"
], dt = [
	"temperature_2m_max",
	"temperature_2m_min",
	"weather_code",
	"precipitation_probability_max",
	"sunrise",
	"sunset"
];
function ft(e, t) {
	let n = t.model === "gfs_seamless" ? "/api/om/v1/gfs" : "/api/om/v1/forecast", r = new URL(n, e), i = Math.min(48, Math.max(2, t.hourly_count + 2)), a = Math.max(1, t.show_daily ? t.daily_count : 1), o = {
		models: t.model,
		latitude: String(t.latitude),
		longitude: String(t.longitude),
		hourly: ut.join(","),
		daily: dt.join(","),
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
function pt(e, t, n, r) {
	let i = e[t];
	return i === void 0 ? Array(n).fill(null) : Array.isArray(i) ? i.length === n ? i : (r.push(`${t} has ${i.length} values, expected ${n}`), Array(n).fill(null)) : (r.push(`${t} is not an array`), Array(n).fill(null));
}
var mt = { "mp/h": "mph" };
function ht(e, t, n) {
	if (z(e) && typeof e[t] == "string") {
		let n = e[t];
		return mt[n] ?? n;
	}
	return n;
}
var gt = class extends Error {};
function _t(e, t) {
	if (!z(e)) throw new gt("response is not an object");
	let n = [], r = z(e.hourly) ? e.hourly : void 0, i = z(e.daily) ? e.daily : void 0;
	if (!r || !Array.isArray(r.time)) throw new gt("response has no hourly.time array");
	let a = r.time, o = Object.fromEntries(ut.map((e) => [e, pt(r, e, a.length, n)])), s = [];
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
		let e = i.time, t = Object.fromEntries(dt.map((t) => [t, pt(i, t, e.length, n)]));
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
	if (s.length === 0) throw new gt(`no usable hourly data: ${n.join("; ")}`);
	return {
		hourly: s,
		daily: c,
		units: {
			temperature: ht(e.hourly_units, "temperature_2m", ""),
			windSpeed: ht(e.hourly_units, "wind_speed_10m", ""),
			precipitation: ht(e.hourly_units, "precipitation", "")
		},
		timezone: typeof e.timezone == "string" ? e.timezone : "UTC",
		utcOffsetSeconds: B(e.utc_offset_seconds) ?? 0,
		gridLatitude: B(e.latitude) ?? NaN,
		gridLongitude: B(e.longitude) ?? NaN,
		model: t
	};
}
function vt(e, t) {
	return e.findIndex((e) => e.time + 3600 > t);
}
function yt(e, t, n) {
	let r = vt(e.hourly, t);
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
function bt(e) {
	let t = null;
	for (let n of e) n.precipitationProbability !== null && (t = t === null ? n.precipitationProbability : Math.max(t, n.precipitationProbability));
	return t;
}
var xt = 1e3, St = class extends Error {
	constructor(e, t) {
		super(e), this.attempts = t;
	}
}, Ct = (e) => new Promise((t) => setTimeout(t, e));
async function wt(e, t, n = {}) {
	let r = n.fetch ?? ((e, t) => globalThis.fetch(e, t)), i = n.sleep ?? Ct, a = n.timeoutMs ?? 3e4, o = [];
	for (let [n, s] of e.entries()) {
		n > 0 && await i(xt * n);
		let e = t(s), c = new AbortController(), l = setTimeout(() => c.abort(), a);
		try {
			let t = await r(e, {
				signal: c.signal,
				headers: { accept: "application/json" },
				cache: "no-store"
			});
			if (!t.ok) {
				o.push(`${s}: HTTP ${t.status}`);
				continue;
			}
			try {
				return await t.json();
			} catch (e) {
				o.push(`${s}: invalid JSON (${e.message})`);
				continue;
			}
		} catch (e) {
			let t = c.signal.aborted ? "timeout" : e.message;
			o.push(`${s}: ${t}`);
		} finally {
			clearTimeout(l);
		}
	}
	throw new St("unavailable from every host", o);
}
async function Tt(e, t = {}) {
	return _t(await wt(e.hosts, (t) => ft(t, e), t), e.model);
}
async function Et(e, t = {}) {
	return $e(await wt(e.hosts, (t) => Ge(t, e.alert_country), t));
}
async function Dt(e, t, n = {}) {
	try {
		return Ye(await wt(e, (e) => Ke(e, t), n));
	} catch {
		return null;
	}
}
//#endregion
//#region src/types.ts
var Ot = {
	metro: 9,
	state: 5.79
}, kt = ["https://data2.weatherwise.app", "https://data1.weatherwise.app"], At = "https://web.weatherwise.app", jt = /* @__PURE__ */ new Set(/* @__PURE__ */ "type.title.latitude.longitude.view.zoom.map_mode.show_map.map_height.map_reload_minutes.map_interactive.map_ui.map_autoplay.show_conditions.show_hourly.hourly_count.show_daily.daily_count.model.temperature_unit.wind_speed_unit.precipitation_unit.refresh_minutes.hosts.layout.show_alerts.alerts_refresh_minutes.alerts_max.alerts_include_outlooks.alert_zones.alert_country.view_layout.layout_options.grid_options.visibility".split(".")), Mt = /* @__PURE__ */ new Set(["metro", "state"]), Nt = /* @__PURE__ */ new Set(["ecmwf_ifs025", "gfs_seamless"]), Pt = /* @__PURE__ */ new Set(["fahrenheit", "celsius"]), Ft = /* @__PURE__ */ new Set([
	"mph",
	"kmh",
	"ms",
	"kn"
]), It = /* @__PURE__ */ new Set(["mm", "inch"]), Lt = /* @__PURE__ */ new Set(["strips", "report"]), Rt = /^[A-Z0-9_-]{1,32}$/;
function zt(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function V(e, t, n, r) {
	let i = e[t];
	return i === void 0 ? (r.required && n.push(`${t}: required`), r.fallback) : typeof i != "number" || !Number.isFinite(i) ? (n.push(`${t}: must be a number`), r.fallback) : r.integer && !Number.isInteger(i) ? (n.push(`${t}: must be a whole number`), r.fallback) : r.min !== void 0 && i < r.min ? (n.push(`${t}: must be at least ${r.min}`), r.fallback) : r.max !== void 0 && i > r.max ? (n.push(`${t}: must be at most ${r.max}`), r.fallback) : i;
}
function H(e, t, n, r) {
	let i = e[t];
	return i === void 0 ? r : typeof i == "boolean" ? i : (n.push(`${t}: must be true or false`), r);
}
function U(e, t, n, r, i) {
	let a = e[t];
	return a === void 0 ? i : typeof a != "string" || !n.has(a) ? (r.push(`${t}: must be one of ${[...n].join(", ")}`), i) : a;
}
function Bt(e, t) {
	let n = e.hosts;
	if (n === void 0) return [...kt];
	if (!Array.isArray(n) || n.length === 0) return t.push("hosts: must be a non-empty list of https origins"), [...kt];
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
	return r.length > 0 ? r : [...kt];
}
function Vt(e, t) {
	let n = e.alert_zones;
	if (n == null || n === "") return [];
	let r;
	if (typeof n == "string") r = n.split(/[\s,]+/).filter((e) => e !== "");
	else if (Array.isArray(n)) r = n;
	else return t.push("alert_zones: must be a list of UGC codes such as TXZ133"), [];
	let i = [];
	for (let [e, n] of r.entries()) {
		if (typeof n != "string" || !Ue.test(n.trim().toUpperCase())) {
			t.push(`alert_zones[${e}]: "${String(n)}" is not a UGC code such as TXZ133 or TXC139`);
			continue;
		}
		i.push(n.trim().toUpperCase());
	}
	return i;
}
function Ht(e) {
	let t = [];
	if (!zt(e)) return { errors: ["configuration must be a mapping"] };
	for (let n of Object.keys(e)) jt.has(n) || t.push(`${n}: unknown option`);
	e.title !== void 0 && typeof e.title != "string" && t.push("title: must be a string");
	let n = V(e, "latitude", t, {
		min: -90,
		max: 90,
		required: !0
	}), r = V(e, "longitude", t, {
		min: -180,
		max: 180,
		required: !0
	}), i = U(e, "view", Mt, t, "metro"), a = V(e, "zoom", t, {
		min: 1,
		max: 18,
		fallback: Ot[i]
	}), o = "RADAR";
	e.map_mode !== void 0 && (typeof e.map_mode != "string" || !Rt.test(e.map_mode) ? t.push("map_mode: must be an upper-case token such as RADAR") : o = e.map_mode);
	let s = "USA";
	e.alert_country !== void 0 && (typeof e.alert_country != "string" || !We.test(e.alert_country) ? t.push("alert_country: must be an upper-case country token such as USA") : s = e.alert_country);
	let c = {
		title: typeof e.title == "string" ? e.title : void 0,
		latitude: n ?? 0,
		longitude: r ?? 0,
		view: i,
		zoom: a ?? Ot[i],
		map_mode: o,
		show_map: H(e, "show_map", t, !0),
		map_height: V(e, "map_height", t, {
			min: 120,
			max: 4e3,
			integer: !0,
			fallback: 480
		}) ?? 480,
		map_reload_minutes: V(e, "map_reload_minutes", t, {
			min: 0,
			max: 1440,
			integer: !0,
			fallback: 0
		}) ?? 0,
		map_interactive: H(e, "map_interactive", t, !1),
		map_ui: H(e, "map_ui", t, !1),
		map_autoplay: H(e, "map_autoplay", t, !0),
		show_conditions: H(e, "show_conditions", t, !0),
		show_hourly: H(e, "show_hourly", t, !0),
		hourly_count: V(e, "hourly_count", t, {
			min: 1,
			max: 48,
			integer: !0,
			fallback: 12
		}) ?? 12,
		show_daily: H(e, "show_daily", t, !1),
		daily_count: V(e, "daily_count", t, {
			min: 1,
			max: 16,
			integer: !0,
			fallback: 5
		}) ?? 5,
		model: U(e, "model", Nt, t, "ecmwf_ifs025"),
		temperature_unit: U(e, "temperature_unit", Pt, t, "fahrenheit"),
		wind_speed_unit: U(e, "wind_speed_unit", Ft, t, "mph"),
		precipitation_unit: U(e, "precipitation_unit", It, t, "inch"),
		refresh_minutes: V(e, "refresh_minutes", t, {
			min: 10,
			max: 1440,
			integer: !0,
			fallback: 30
		}) ?? 30,
		hosts: Bt(e, t),
		layout: U(e, "layout", Lt, t, "strips"),
		show_alerts: H(e, "show_alerts", t, !0),
		alerts_refresh_minutes: V(e, "alerts_refresh_minutes", t, {
			min: 2,
			max: 60,
			integer: !0,
			fallback: 5
		}) ?? 5,
		alerts_max: V(e, "alerts_max", t, {
			min: 1,
			max: 10,
			integer: !0,
			fallback: 3
		}) ?? 3,
		alerts_include_outlooks: H(e, "alerts_include_outlooks", t, !1),
		alert_zones: Vt(e, t),
		alert_country: s
	};
	return t.length > 0 ? { errors: t } : {
		config: c,
		errors: t
	};
}
function Ut(e) {
	return e.show_conditions || e.show_hourly || e.show_daily;
}
//#endregion
//#region src/conditions.ts
var Wt = {
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
function W(e, t) {
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
		label: Wt[r]
	};
}
function Gt(e) {
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
var G = (e) => ({
	name: "",
	type: "grid",
	flatten: !0,
	schema: e
}), Kt = [
	{
		name: "title",
		selector: { text: {} }
	},
	G([{
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
	G([{
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
		schema: [G([
			{
				name: "show_map",
				selector: { boolean: {} }
			},
			{
				name: "map_interactive",
				selector: { boolean: {} }
			},
			{
				name: "map_ui",
				selector: { boolean: {} }
			},
			{
				name: "map_autoplay",
				selector: { boolean: {} }
			},
			{
				name: "map_mode",
				selector: { text: {} }
			}
		]), G([{
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
			G([
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
				},
				{
					name: "layout",
					selector: { select: {
						mode: "dropdown",
						options: [{
							value: "strips",
							label: "Compact strips"
						}, {
							value: "report",
							label: "Report tables"
						}]
					} }
				}
			]),
			G([
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
			G([
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
	},
	{
		name: "",
		type: "expandable",
		flatten: !0,
		title: "Alerts",
		schema: [
			G([{
				name: "show_alerts",
				selector: { boolean: {} }
			}, {
				name: "alerts_include_outlooks",
				selector: { boolean: {} }
			}]),
			G([{
				name: "alerts_max",
				selector: { number: {
					min: 1,
					max: 10,
					mode: "box"
				} }
			}, {
				name: "alerts_refresh_minutes",
				selector: { number: {
					min: 2,
					max: 60,
					mode: "box",
					unit_of_measurement: "min"
				} }
			}]),
			G([{
				name: "alert_zones",
				selector: { text: {} }
			}, {
				name: "alert_country",
				selector: { text: {} }
			}])
		]
	}
], qt = {
	title: "Title",
	latitude: "Latitude",
	longitude: "Longitude",
	view: "View preset",
	zoom: "Zoom (overrides the preset)",
	show_map: "Show the WeatherWise map",
	map_interactive: "Allow touch, mouse, and wheel input on the map",
	map_ui: "Show the WeatherWise app controls and popups",
	map_autoplay: "Start radar playback automatically",
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
	precipitation_unit: "Precipitation unit",
	layout: "Forecast layout",
	show_alerts: "Show local alerts",
	alerts_include_outlooks: "Include outlooks and short term forecasts",
	alerts_max: "Alerts to show",
	alerts_refresh_minutes: "Alert refresh interval",
	alert_zones: "Zone codes (optional)",
	alert_country: "Warnings feed country"
}, Jt = {
	layout: "Strips show one tile per hour and day. Report shows tables with feels-like, rain amount, wind, humidity, sunrise and sunset.",
	show_alerts: "Warnings, watches, advisories, and statements from the WeatherWise warnings feed that cover this point, matched by polygon or by the zone codes below.",
	alerts_include_outlooks: "Off by default: Hazardous Weather Outlooks, Hydrologic Outlooks, and Short Term Forecasts are routine products, not hazards.",
	alert_zones: "NWS UGC codes for this point, comma separated, such as TXZ133 or TXC139. A listed code matches without a polygon lookup; leave empty to rely on the polygon test alone.",
	alert_country: "The country token in the feed path. Only USA is verified.",
	view: "Metro centers tightly on the point; State pulls back to the whole state. Set zoom to override.",
	map_interactive: "Off by default for display boards: a stray touch or wheel event would otherwise pan or zoom the map away until the next reload.",
	map_ui: "Off by default: the app then hides its mode selector, buttons, and the App Updates announcement that otherwise covers the map on a kiosk.",
	map_mode: "Upper-case token from the WeatherWise URL, RADAR by default. Other modes are unverified.",
	map_reload_minutes: "0 never reloads. A periodic reload guards a kiosk against a stuck embedded page.",
	refresh_minutes: "Minimum 10 minutes. Forecast data is modeled, not measured; it changes on model runs, not by the minute."
};
function Yt() {
	return {
		schema: Kt,
		computeLabel: (e) => qt[e.name],
		computeHelper: (e) => Jt[e.name]
	};
}
//#endregion
//#region src/format.ts
function K(e, t, n) {
	try {
		return new Intl.DateTimeFormat(n, {
			hour: "numeric",
			timeZone: t
		}).format(/* @__PURE__ */ new Date(e * 1e3));
	} catch {
		return (/* @__PURE__ */ new Date(e * 1e3)).toISOString().slice(11, 16);
	}
}
function q(e, t, n) {
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
function Xt(e, t, n) {
	try {
		return new Intl.DateTimeFormat(n, {
			weekday: "short",
			timeZone: t
		}).format(/* @__PURE__ */ new Date(e * 1e3));
	} catch {
		return (/* @__PURE__ */ new Date(e * 1e3)).toISOString().slice(0, 10);
	}
}
function Zt(e, t, n) {
	try {
		return new Intl.DateTimeFormat(n, {
			weekday: "short",
			hour: "numeric",
			minute: "2-digit",
			timeZone: t
		}).format(/* @__PURE__ */ new Date(e * 1e3));
	} catch {
		return (/* @__PURE__ */ new Date(e * 1e3)).toISOString().slice(0, 16).replace("T", " ");
	}
}
function Qt(e) {
	let t = Math.round(e / 6e4);
	return t < 1 ? "just now" : t < 60 ? `${t} min ago` : `${Math.floor(t / 60)} h ${t % 60} min ago`;
}
function J(e, t = 0) {
	return e === null || !Number.isFinite(e) ? "--" : e.toFixed(t);
}
//#endregion
//#region src/icons.ts
var $t = E`<circle cx="12" cy="12" r="4" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="4.5"/><line x1="12" y1="19.5" x2="12" y2="22"/><line x1="2" y1="12" x2="4.5" y2="12"/><line x1="19.5" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="6.7" y2="6.7"/><line x1="17.3" y1="17.3" x2="19.1" y2="19.1"/><line x1="4.9" y1="19.1" x2="6.7" y2="17.3"/><line x1="17.3" y1="6.7" x2="19.1" y2="4.9"/></g>`, en = E`<path fill="currentColor" d="M14.5 2.5a9.5 9.5 0 1 0 7 15.6A8 8 0 0 1 14.5 2.5z"/>`, tn = E`<path fill="currentColor" d="M6.5 19a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 17.6 9.1 4 4 0 0 1 17.5 19H6.5z"/>`, nn = E`<path fill="currentColor" d="M9 20a3.5 3.5 0 0 1-.5-6.96A5 5 0 0 1 18.2 12 3.2 3.2 0 0 1 18 20H9z"/>`, rn = (e) => E`<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="${e}" x2="7" y2="${e + 3}"/><line x1="12" y1="${e}" x2="11" y2="${e + 3}"/><line x1="16" y1="${e}" x2="15" y2="${e + 3}"/></g>`, Y = E`<path fill="currentColor" d="M6.5 15a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 16.6 6 3.6 3.6 0 0 1 17.2 15H6.5z"/>`, an = {
	"clear-day": $t,
	"clear-night": en,
	"partly-cloudy-day": E`<g transform="translate(-3 -3) scale(0.8)">${$t}</g>${nn}`,
	"partly-cloudy-night": E`<g transform="translate(-2 -3) scale(0.7)">${en}</g>${nn}`,
	cloudy: tn,
	fog: E`${Y}<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="18" x2="19" y2="18"/><line x1="7" y1="21.5" x2="17" y2="21.5"/></g>`,
	rain: E`${Y}${rn(18)}`,
	pouring: E`${Y}${rn(17)}<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="10" y1="21" x2="9.5" y2="23"/><line x1="14" y1="21" x2="13.5" y2="23"/></g>`,
	sleet: E`${Y}<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="18" x2="7" y2="21"/><line x1="16" y1="18" x2="15" y2="21"/></g><circle cx="12" cy="20" r="1.5" fill="currentColor"/>`,
	snow: E`${Y}<g fill="currentColor"><circle cx="8" cy="19" r="1.5"/><circle cx="12" cy="21.5" r="1.5"/><circle cx="16" cy="19" r="1.5"/></g>`,
	thunderstorm: E`${Y}<path fill="currentColor" d="M12.5 15.5 9.5 20h2.5l-1 3.5 3.5-5h-2.5z"/>`,
	hail: E`${Y}<path fill="currentColor" d="M11 15.5 8.5 19.5h2l-.8 3 3-4.5h-2z"/><circle cx="16" cy="19.5" r="1.6" fill="currentColor"/>`,
	unknown: E`<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><text x="12" y="16.5" text-anchor="middle" font-size="12" fill="currentColor">?</text>`
};
function X(e, t = 24) {
	return E`<svg viewBox="0 0 24 24" width="${t}" height="${t}" aria-hidden="true">${an[e]}</svg>`;
}
//#endregion
//#region src/map-url.ts
function on(e, t) {
	return Number(e.toFixed(t)).toString();
}
function sn(e) {
	let t = [`map=${on(e.zoom, 2)}/${on(e.latitude, 4)}/${on(e.longitude, 4)}`, `m=${e.map_mode}`];
	return e.map_ui || t.push("ui=0"), e.map_autoplay && t.push("autoplay=1"), `${At}/#${t.join("&")}`;
}
//#endregion
//#region src/styles.ts
var cn = o`
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
var ln, Q = 6e4, un = 2;
function dn(e) {
	return e instanceof St ? e.attempts.join("; ") : e.message;
}
var $ = class extends P {
	constructor(...e) {
		super(...e), this.loading = !1, this.now = Date.now(), this.mapGeneration = 0, this.unresolvedAlerts = [], this.forecastKey = "", this.alertsKey = "", this.alertsLoading = !1, this.geometryCache = /* @__PURE__ */ new Map();
	}
	setConfig(e) {
		let t = Ht(e);
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
		e.show_conditions && (t += 2), e.show_alerts && (t += 1), e.show_map && (t += Math.ceil(e.map_height / 50));
		let n = e.layout === "report";
		return e.show_hourly && (t += n ? Math.ceil(e.hourly_count / 2) + 1 : 2), e.show_daily && (t += n ? Math.ceil(e.daily_count / 2) + 1 : 2), t;
	}
	getGridOptions() {
		return {
			columns: "full",
			min_columns: 6
		};
	}
	static getConfigForm() {
		return Yt();
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
			}, Q), Ut(this.config)) {
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
			if (this.config.show_alerts) {
				let e = JSON.stringify([
					this.config.latitude,
					this.config.longitude,
					this.config.alert_zones,
					this.config.alert_country,
					this.config.alerts_include_outlooks,
					this.config.hosts
				]);
				e !== this.alertsKey && (this.alertsKey = e, this.alerts = void 0, this.unresolvedAlerts = [], this.alertsFetchedAt = void 0, this.alertsError = void 0, this.geometryCache.clear()), this.refreshAlerts(), this.alertsTimer = setInterval(() => void this.refreshAlerts(), this.config.alerts_refresh_minutes * Q);
			}
			this.config.show_map && this.config.map_reload_minutes > 0 && (this.mapTimer = setInterval(() => {
				this.mapGeneration += 1;
			}, this.config.map_reload_minutes * Q));
		}
	}
	disarm() {
		for (let e of [
			this.pollTimer,
			this.alertsTimer,
			this.tickTimer,
			this.mapTimer
		]) e !== void 0 && clearInterval(e);
		this.pollTimer = this.alertsTimer = this.tickTimer = this.mapTimer = void 0;
	}
	async refreshAlerts() {
		let e = this.config;
		if (!e || this.alertsLoading) return;
		this.alertsLoading = !0;
		let t = this.alertsKey;
		try {
			let n = await Et(e), r = new Set(n.map((e) => e.id));
			for (let e of this.geometryCache.keys()) r.has(e) || this.geometryCache.delete(e);
			let { matched: i, unresolved: a } = await lt(n, {
				latitude: e.latitude,
				longitude: e.longitude,
				zones: e.alert_zones,
				nowMs: Date.now(),
				includeOutlooks: e.alerts_include_outlooks,
				fetchGeometry: async (t) => {
					let n = this.geometryCache.get(t);
					if (n != null) return n;
					let r = await Dt(e.hosts, t);
					return this.geometryCache.set(t, r), r;
				}
			});
			if (t !== this.alertsKey) return;
			this.alerts = i, this.unresolvedAlerts = a, this.alertsFetchedAt = Date.now(), this.alertsError = void 0;
		} catch (e) {
			if (t !== this.alertsKey) return;
			this.alertsError = dn(e);
		} finally {
			this.alertsLoading = !1, this.now = Date.now();
		}
	}
	async refresh() {
		if (!this.config || this.loading) return;
		this.loading = !0;
		let e = this.forecastKey;
		try {
			let t = await Tt(this.config);
			if (e !== this.forecastKey) return;
			this.forecast = t, this.fetchedAt = Date.now(), this.lastError = void 0;
		} catch (t) {
			if (e !== this.forecastKey) return;
			this.lastError = dn(t);
		} finally {
			this.loading = !1, this.now = Date.now();
		}
	}
	locale() {
		return this._hass?.locale?.language ?? this._hass?.language;
	}
	render() {
		let e = this.config;
		return e ? T`
      <div class="card">
        ${this.renderHeader(e)}
        ${e.show_alerts ? this.renderAlerts(e) : O}
        ${e.show_map ? this.renderMap(e) : O}
        ${e.show_hourly ? e.layout === "report" ? this.renderHourlyReport(e) : this.renderHourly(e) : O}
        ${e.show_daily ? e.layout === "report" ? this.renderDailyReport(e) : this.renderDaily(e) : O}
        ${this.renderFooter(e)}
      </div>
    ` : T`<div class="card"><div class="problems">No configuration</div></div>`;
	}
	renderAlerts(e) {
		let t = this.alerts;
		if (!t || t.length === 0) return O;
		let n = this.forecast?.timezone, r = this.locale(), i = this.now / 1e3;
		return T`<div class="alerts" role="list">
      ${t.slice(0, e.alerts_max).map((e) => {
			let t = e.startsAt === null ? null : e.startsAt / 1e3, a = e.expiresAt === null ? null : e.expiresAt / 1e3, o = t !== null && t > i ? `from ${Zt(t, n, r)}` : a === null ? "" : `until ${Zt(a, n, r)}`;
			return T`<div class="alert sig-${e.significance} ${e.emergency ? "emergency" : ""}" role="listitem" title=${e.where ?? ""}>
          <span class="name">${e.title}</span>
          <span class="until">${o}</span>
          ${e.what ? T`<span class="what">${e.what}</span>` : O}
        </div>`;
		})}
    </div>`;
	}
	renderAlertStatus() {
		let e = [];
		return this.config?.show_alerts ? (this.alertsError ? e.push(T`<span class="badge error">alerts unavailable</span><span>${this.alertsError}</span>`) : this.alertsFetchedAt !== void 0 && this.alerts && e.push(T`<span>${this.alerts.length === 0 ? "no local alerts" : `${this.alerts.length} local alert${this.alerts.length === 1 ? "" : "s"}`}</span>`), this.unresolvedAlerts.length > 0 && e.push(T`<span class="badge stale">unresolved</span><span>${this.unresolvedAlerts.map((e) => e.title).join(", ")}: polygon unavailable, not shown</span>`), e) : e;
	}
	hourlyRows(e) {
		let t = this.forecast;
		if (!t) return null;
		let n = yt(t, Math.floor(this.now / 1e3), e.hourly_count);
		return n.upcoming.length === 0 ? null : {
			f: t,
			rows: n.upcoming
		};
	}
	renderHourlyReport(e) {
		let t = this.hourlyRows(e);
		if (!t) return O;
		let { f: n, rows: r } = t, i = this.locale();
		return T`<div class="report-wrap"><table class="report">
      <thead><tr>
        <th>Hour</th><th>Conditions</th><th class="num">Temp</th><th class="num">Feels</th>
        <th class="num">Rain</th><th class="num">Amount</th><th>Wind</th><th class="num">Humidity</th>
      </tr></thead>
      <tbody>
        ${r.map((e) => {
			let t = W(e.weatherCode, e.isDay);
			return T`<tr>
            <td>${K(e.time, n.timezone, i)}</td>
            <td><span class="cond"><span class="icon">${X(t.key, 20)}</span>${t.label}</span></td>
            <td class="num">${J(e.temperature)}${n.units.temperature}</td>
            <td class="num">${J(e.apparentTemperature)}${n.units.temperature}</td>
            <td class="num">${J(e.precipitationProbability)}%</td>
            <td class="num">${J(e.precipitation, 2)} ${n.units.precipitation}</td>
            <td>${J(e.windSpeed)} ${n.units.windSpeed} ${Gt(e.windBearing)}</td>
            <td class="num">${J(e.humidity)}%</td>
          </tr>`;
		})}
      </tbody>
    </table></div>`;
	}
	renderDailyReport(e) {
		let t = this.forecast;
		if (!t || t.daily.length === 0) return O;
		let n = this.locale();
		return T`<div class="report-wrap"><table class="report">
      <thead><tr>
        <th>Day</th><th>Conditions</th><th class="num">High</th><th class="num">Low</th>
        <th class="num">Rain</th><th>Sunrise</th><th>Sunset</th>
      </tr></thead>
      <tbody>
        ${t.daily.slice(0, e.daily_count).map((e) => {
			let r = W(e.weatherCode, !0);
			return T`<tr>
            <td>${Xt(e.time, t.timezone, n)}</td>
            <td><span class="cond"><span class="icon">${X(r.key, 20)}</span>${r.label}</span></td>
            <td class="num">${J(e.temperatureMax)}${t.units.temperature}</td>
            <td class="num lo">${J(e.temperatureMin)}${t.units.temperature}</td>
            <td class="num">${J(e.precipitationProbabilityMax)}%</td>
            <td>${e.sunrise === null ? "--" : q(e.sunrise, t.timezone, n)}</td>
            <td>${e.sunset === null ? "--" : q(e.sunset, t.timezone, n)}</td>
          </tr>`;
		})}
      </tbody>
    </table></div>`;
	}
	renderHeader(e) {
		return T`
      <div class="header">
        <div class="title">${e.title ?? (e.view === "state" ? "State radar" : "Metro radar")}</div>
        ${e.show_conditions ? this.renderHeadline(e) : O}
      </div>
    `;
	}
	renderHeadline(e) {
		let t = this.forecast;
		if (!t) return T`<div class="meta">
        ${this.lastError ? T`<span class="badge error">unavailable</span><span>${this.lastError}</span>` : T`<span>Loading forecast</span>`}
      </div>`;
		let n = yt(t, Math.floor(this.now / 1e3), e.hourly_count), r = n.current;
		if (!r) return T`<div class="meta"><span class="badge stale">expired</span><span>Forecast window has passed; waiting for refresh</span></div>`;
		let i = W(r.weatherCode, r.isDay), a = this.locale(), o = bt([r, ...n.upcoming]);
		return T`
      <div class="headline">
        <span class="icon" title=${i.label}>${X(i.key, 44)}</span>
        <span class="temp">${J(r.temperature)}${t.units.temperature}</span>
        <div class="details">
          <span>${i.label}</span>
          <span>Feels <b>${J(r.apparentTemperature)}${t.units.temperature}</b></span>
          <span>Rain <b>${J(r.precipitationProbability)}%</b>${o !== null && o !== r.precipitationProbability ? T` (max ${J(o)}%)` : O}</span>
          <span>Wind <b>${J(r.windSpeed)} ${t.units.windSpeed}</b> ${Gt(r.windBearing)}</span>
          <span>Humidity <b>${J(r.humidity)}%</b></span>
          <span>Valid <b>${K(r.time, t.timezone, a)}</b></span>
        </div>
      </div>
      ${this.renderStatus(e)}
    `;
	}
	renderStatus(e) {
		let t = [];
		if (this.fetchedAt !== void 0) {
			let n = this.now - this.fetchedAt;
			n > e.refresh_minutes * Q * un && t.push(T`<span class="badge stale">stale</span>`), t.push(T`<span>fetched ${Qt(n)}</span>`);
		}
		return this.lastError && t.push(T`<span class="badge error">refresh failed</span><span>${this.lastError}</span>`), t.push(...this.renderAlertStatus()), T`<div class="meta">${t}</div>`;
	}
	renderMap(e) {
		let t = sn(e);
		return T`
      <div class="map ${e.map_interactive ? "" : "locked"}" style="height:${e.map_height}px">
        ${He(this.mapGeneration, T`<iframe
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
		let t = this.hourlyRows(e);
		if (!t) return O;
		let { f: n, rows: r } = t, i = this.locale();
		return T`<div class="strip">
      ${r.map((e) => {
			let t = W(e.weatherCode, e.isDay);
			return T`<div class="tile">
          <span class="when">${K(e.time, n.timezone, i)}</span>
          <span class="icon" title=${t.label}>${X(t.key, 26)}</span>
          <span>${J(e.temperature)}${n.units.temperature}</span>
          <span class="rain">${J(e.precipitationProbability)}%</span>
        </div>`;
		})}
    </div>`;
	}
	renderDaily(e) {
		let t = this.forecast;
		if (!t || t.daily.length === 0) return O;
		let n = this.locale();
		return T`<div class="strip">
      ${t.daily.slice(0, e.daily_count).map((e) => {
			let r = W(e.weatherCode, !0);
			return T`<div class="tile">
          <span class="when">${Xt(e.time, t.timezone, n)}</span>
          <span class="icon" title=${r.label}>${X(r.key, 26)}</span>
          <span>${J(e.temperatureMax)}${t.units.temperature} <span class="lo">${J(e.temperatureMin)}${t.units.temperature}</span></span>
          <span class="rain">${J(e.precipitationProbabilityMax)}%</span>
        </div>`;
		})}
    </div>`;
	}
	renderFooter(e) {
		let t = this.forecast, n = t?.daily[0], r = this.locale();
		return T`<div class="footer">
      <span>
        <a href=${sn(e)} target="_blank" rel="noopener noreferrer">WeatherWise</a>
        ${t ? T` · ${t.model === "gfs_seamless" ? "GFS" : "ECMWF"} model, grid ${J(t.gridLatitude, 2)}, ${J(t.gridLongitude, 2)}` : O}
      </span>
      ${n && n.sunrise !== null && n.sunset !== null && t ? T`<span>Sunrise ${q(n.sunrise, t.timezone, r)} · Sunset ${q(n.sunset, t.timezone, r)}</span>` : O}
    </div>`;
	}
};
ln = $, ln.styles = [cn, o`
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
      .alerts {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .alert {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 2px 10px;
        padding: 8px 10px;
        border-radius: 8px;
        background: var(--wwc-tile);
        border-left: 5px solid var(--wwc-text-dim);
        font-size: 13px;
      }
      .alert.sig-W {
        border-left-color: var(--wwc-error);
      }
      .alert.sig-A {
        border-left-color: var(--wwc-warn);
      }
      .alert.sig-Y {
        border-left-color: var(--wwc-accent);
      }
      .alert.emergency {
        background: var(--wwc-error);
        color: #fff;
      }
      .alert .name {
        font-weight: 600;
        font-size: 14px;
      }
      .alert .until {
        color: var(--wwc-text-dim);
        text-align: right;
        white-space: nowrap;
      }
      .alert.emergency .until {
        color: inherit;
      }
      .alert .what {
        grid-column: 1 / -1;
        color: var(--wwc-text-dim);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .alert.emergency .what {
        color: inherit;
      }
      table.report {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }
      table.report th {
        text-align: left;
        font-weight: 500;
        color: var(--wwc-text-dim);
        padding: 4px 6px;
        border-bottom: 1px solid var(--wwc-divider);
        white-space: nowrap;
      }
      table.report td {
        padding: 5px 6px;
        border-bottom: 1px solid var(--wwc-divider);
        white-space: nowrap;
      }
      table.report tr:last-child td {
        border-bottom: 0;
      }
      table.report .cond {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      table.report .cond .icon {
        color: var(--wwc-accent);
        display: inline-flex;
      }
      table.report .num {
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
      table.report .lo {
        color: var(--wwc-text-dim);
      }
      .report-wrap {
        overflow-x: auto;
      }
    `], Z([Ie({ attribute: !1 })], $.prototype, "config", void 0), Z([F()], $.prototype, "forecast", void 0), Z([F()], $.prototype, "fetchedAt", void 0), Z([F()], $.prototype, "lastError", void 0), Z([F()], $.prototype, "loading", void 0), Z([F()], $.prototype, "now", void 0), Z([F()], $.prototype, "mapGeneration", void 0), Z([F()], $.prototype, "alerts", void 0), Z([F()], $.prototype, "unresolvedAlerts", void 0), Z([F()], $.prototype, "alertsFetchedAt", void 0), Z([F()], $.prototype, "alertsError", void 0), customElements.define("weatherwise-card", $), window.customCards = window.customCards ?? [], window.customCards.push({
	type: "weatherwise-card",
	name: "WeatherWise Card",
	description: "Embedded WeatherWise radar map at metro or state zoom with a modeled-conditions headline, local alerts, and hourly and daily forecast strips or tables. Built for kiosk displays.",
	documentationURL: "https://github.com/trooperthorn/ha_card_weatherwise"
}), console.info("%c WEATHERWISE-CARD %c v2026.09.30.3 ", "background: #444; color: #fff; border-radius: 3px 0 0 3px; padding: 2px 0;", "background: #38bdf8; color: #111; border-radius: 0 3px 3px 0; padding: 2px 0;");
//#endregion
export { $ as WeatherWiseCard };
