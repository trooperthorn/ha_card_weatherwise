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
var ce = globalThis, le = (e) => e, g = ce.trustedTypes, ue = g ? g.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, de = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, fe = "?" + _, pe = `<${fe}>`, v = document, y = () => v.createComment(""), b = (e) => e === null || typeof e != "object" && typeof e != "function", me = Array.isArray, he = (e) => me(e) || typeof e?.[Symbol.iterator] == "function", x = "[ 	\n\f\r]", S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ge = /-->/g, _e = />/g, C = RegExp(`>|${x}(?:([^\\s"'>=/]+)(${x}*=${x}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ve = /'/g, ye = /"/g, be = /^(?:script|style|textarea|title)$/i, xe = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), w = xe(1), T = xe(2), E = Symbol.for("lit-noChange"), D = Symbol.for("lit-nothing"), Se = /* @__PURE__ */ new WeakMap(), O = v.createTreeWalker(v, 129);
function Ce(e, t) {
	if (!me(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ue === void 0 ? t : ue.createHTML(t);
}
var we = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = S;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === S ? c[1] === "!--" ? o = ge : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = C) : (be.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = C) : o = _e : o === C ? c[0] === ">" ? (o = i ?? S, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? C : c[3] === "\"" ? ye : ve) : o === ye || o === ve ? o = C : o === ge || o === _e ? o = S : (o = C, i = void 0);
		let d = o === C && e[t + 1].startsWith("/>") ? " " : "";
		a += o === S ? n + pe : l >= 0 ? (r.push(s), n.slice(0, l) + de + n.slice(l) + _ + d) : n + _ + (l === -2 ? t : d);
	}
	return [Ce(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Te = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = we(t, n);
		if (this.el = e.createElement(l, r), O.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = O.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(de)) {
					let t = u[o++], n = i.getAttribute(e).split(_), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? De : r[1] === "?" ? Oe : r[1] === "@" ? ke : j
					}), i.removeAttribute(e);
				} else e.startsWith(_) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (be.test(i.tagName)) {
					let e = i.textContent.split(_), t = e.length - 1;
					if (t > 0) {
						i.textContent = g ? g.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], y()), O.nextNode(), c.push({
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
function k(e, t, n = e, r) {
	if (t === E) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = b(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = k(e, i._$AS(e, t.values), i, r)), t;
}
var Ee = class {
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
		O.currentNode = r;
		let i = O.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new A(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ae(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = O.nextNode(), a++);
		}
		return O.currentNode = v, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, A = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = D, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = k(this, e, t), b(e) ? e === D || e == null || e === "" ? (this._$AH !== D && this._$AR(), this._$AH = D) : e !== this._$AH && e !== E && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? he(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== D && b(this._$AH) ? this._$AA.nextSibling.data = e : this.T(v.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Te.createElement(Ce(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ee(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Se.get(e.strings);
		return t === void 0 && Se.set(e.strings, t = new Te(e)), t;
	}
	k(t) {
		me(this._$AH) || (this._$AH = [], this._$AR());
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
}, j = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = D, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = D;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = k(this, e, t, 0), a = !b(e) || e !== this._$AH && e !== E, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = k(this, r[n + o], t, o), s === E && (s = this._$AH[o]), a ||= !b(s) || s !== this._$AH[o], s === D ? e = D : e !== D && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === D ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, De = class extends j {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === D ? void 0 : e;
	}
}, Oe = class extends j {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== D);
	}
}, ke = class extends j {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = k(this, e, t, 0) ?? D) === E) return;
		let n = this._$AH, r = e === D && n !== D || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== D && (n === D || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Ae = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		k(this, e);
	}
}, je = {
	M: de,
	P: _,
	A: fe,
	C: 1,
	L: we,
	R: Ee,
	D: he,
	V: k,
	I: A,
	H: j,
	N: Oe,
	U: ke,
	B: De,
	F: Ae
}, Me = ce.litHtmlPolyfillSupport;
Me?.(Te, A), (ce.litHtmlVersions ??= []).push("3.3.3");
var Ne = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new A(t.insertBefore(y(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Pe = globalThis, M = class extends h {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ne(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return E;
	}
};
M._$litElement$ = !0, M.finalized = !0, Pe.litElementHydrateSupport?.({ LitElement: M });
var Fe = Pe.litElementPolyfillSupport;
Fe?.({ LitElement: M }), (Pe.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
var Ie = {
	attribute: !0,
	type: String,
	converter: m,
	reflect: !1,
	hasChanged: oe
}, Le = (e = Ie, t, n) => {
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
function Re(e) {
	return (t, n) => typeof n == "object" ? Le(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function N(e) {
	return Re({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/lit-html/directive.js
var ze = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Be = class {
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
}, { I: Ve } = je, He = {}, Ue = (e, t = He) => e._$AH = t, We = ze(class extends Be {
	constructor() {
		super(...arguments), this.key = D;
	}
	render(e, t) {
		return this.key = e, t;
	}
	update(e, [t, n]) {
		return t !== this.key && (Ue(e), this.key = t), n;
	}
}), Ge = /^[A-Z]{2}[CZ]\d{3}$/, Ke = /^[A-Z]{2,3}$/;
function qe(e, t) {
	return new URL(`/warnings/${t}.geojson`, e).toString();
}
function Je(e, t) {
	return new URL(`/warnings/archive/${t}-geometry.geojson`, e).toString();
}
function P(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function F(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function I(e) {
	return typeof e == "string" && e.trim() !== "" ? e.trim() : null;
}
function Ye(e) {
	return Array.isArray(e) && e.length >= 4 && e.every((e) => Array.isArray(e) && e.length >= 2 && F(e[0]) !== null && F(e[1]) !== null);
}
function Xe(e) {
	return !P(e) || !Array.isArray(e.coordinates) ? null : e.type === "Polygon" && e.coordinates.every(Ye) ? {
		type: "Polygon",
		coordinates: e.coordinates
	} : e.type === "MultiPolygon" && e.coordinates.every((e) => Array.isArray(e) && e.every(Ye)) ? {
		type: "MultiPolygon",
		coordinates: e.coordinates
	} : null;
}
function Ze(e) {
	return P(e) ? e.type === "Feature" ? Xe(e.geometry) : Xe(e) : null;
}
function Qe(e) {
	if (!Array.isArray(e) || e.length !== 4) return null;
	let t = e.map(F);
	return t.some((e) => e === null) ? null : t;
}
function $e(e) {
	if (!P(e) || !P(e.properties)) return null;
	let t = e.properties, n = I(t.id), r = I(t.title);
	if (n === null || r === null) return null;
	let i = P(t.tags) ? t.tags : {};
	return {
		id: n,
		title: r,
		product: I(t.product) ?? "",
		significance: I(t.significance) ?? "",
		emergency: t.emergency === !0,
		office: I(t.office),
		issuedAt: F(t.issued_at_ms),
		startsAt: F(t.starts_at_ms),
		expiresAt: F(t.expires_at_ms),
		ugcs: Array.isArray(t.ugcs) ? t.ugcs.filter((e) => typeof e == "string") : [],
		bbox: Qe(t.bbox),
		what: I(i.WHAT),
		where: I(i.WHERE),
		when: I(i.WHEN),
		impacts: I(i.IMPACTS),
		geometry: Xe(e.geometry)
	};
}
var et = class extends Error {};
function tt(e) {
	if (!P(e) || !Array.isArray(e.features)) throw new et("response is not a FeatureCollection");
	let t = [];
	for (let n of e.features) {
		let e = $e(n);
		e && t.push(e);
	}
	return t;
}
function nt(e, t, n) {
	let r = !1, i = n.length;
	for (let a = 0, o = i - 1; a < i; o = a, a += 1) {
		let [i, s] = n[a], [c, l] = n[o];
		s > t != l > t && e < (c - i) * (t - s) / (l - s) + i && (r = !r);
	}
	return r;
}
function rt(e, t, n) {
	let [r, ...i] = n;
	return !r || !nt(e, t, r) ? !1 : !i.some((n) => nt(e, t, n));
}
function it(e, t, n) {
	return n.type === "Polygon" ? rt(e, t, n.coordinates) : n.coordinates.some((n) => rt(e, t, n));
}
function at(e, t, n) {
	let [r, i, a, o] = e;
	return t >= r && t <= a && n >= i && n <= o;
}
function ot(e, t) {
	return e.expiresAt === null || e.expiresAt > t;
}
function st(e) {
	return e.significance === "O" || e.significance === "F";
}
var ct = {
	W: 0,
	A: 1,
	Y: 2,
	S: 3,
	F: 4,
	O: 5
};
function lt(e) {
	let t = ct[e.significance] ?? 6;
	return e.emergency ? -1 : t;
}
function ut(e, t) {
	let n = lt(e) - lt(t);
	return n === 0 ? (t.issuedAt ?? 0) - (e.issuedAt ?? 0) : n;
}
async function dt(e, t) {
	let { latitude: n, longitude: r, zones: i, nowMs: a, includeOutlooks: o, fetchGeometry: s } = t, c = new Set(i), l = [], u = [], d = e.filter((e) => ot(e, a) && (o || !st(e)) && (e.bbox === null || at(e.bbox, r, n)));
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
		it(r, n, t) && l.push({
			...e,
			matchedBy: "polygon"
		});
	}
	return l.sort(ut), {
		matched: l,
		unresolved: u
	};
}
//#endregion
//#region src/forecast.ts
var ft = [
	"temperature_2m",
	"apparent_temperature",
	"relative_humidity_2m",
	"precipitation_probability",
	"precipitation",
	"wind_speed_10m",
	"wind_direction_10m",
	"weather_code",
	"is_day"
], pt = [
	"temperature_2m_max",
	"temperature_2m_min",
	"weather_code",
	"precipitation_probability_max",
	"sunrise",
	"sunset"
];
function mt(e, t) {
	let n = t.model === "gfs_seamless" ? "/api/om/v1/gfs" : "/api/om/v1/forecast", r = new URL(n, e), i = Math.min(48, Math.max(2, t.hourly_count + 2)), a = Math.max(1, t.show_daily ? t.daily_count : 1), o = {
		models: t.model,
		latitude: String(t.latitude),
		longitude: String(t.longitude),
		hourly: ft.join(","),
		daily: pt.join(","),
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
function L(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function R(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function ht(e, t, n, r) {
	let i = e[t];
	return i === void 0 ? Array(n).fill(null) : Array.isArray(i) ? i.length === n ? i : (r.push(`${t} has ${i.length} values, expected ${n}`), Array(n).fill(null)) : (r.push(`${t} is not an array`), Array(n).fill(null));
}
var gt = { "mp/h": "mph" };
function z(e, t, n) {
	if (L(e) && typeof e[t] == "string") {
		let n = e[t];
		return gt[n] ?? n;
	}
	return n;
}
var B = class extends Error {};
function _t(e, t) {
	if (!L(e)) throw new B("response is not an object");
	let n = [], r = L(e.hourly) ? e.hourly : void 0, i = L(e.daily) ? e.daily : void 0;
	if (!r || !Array.isArray(r.time)) throw new B("response has no hourly.time array");
	let a = r.time, o = Object.fromEntries(ft.map((e) => [e, ht(r, e, a.length, n)])), s = [];
	for (let [e, t] of a.entries()) {
		let r = R(t);
		if (r === null) {
			n.push(`hourly.time[${e}] is not a number`);
			continue;
		}
		let i = R(o.is_day[e]);
		s.push({
			time: r,
			temperature: R(o.temperature_2m[e]),
			apparentTemperature: R(o.apparent_temperature[e]),
			humidity: R(o.relative_humidity_2m[e]),
			precipitationProbability: R(o.precipitation_probability[e]),
			precipitation: R(o.precipitation[e]),
			windSpeed: R(o.wind_speed_10m[e]),
			windBearing: R(o.wind_direction_10m[e]),
			weatherCode: R(o.weather_code[e]),
			isDay: i === null ? null : i === 1
		});
	}
	let c = [];
	if (i && Array.isArray(i.time)) {
		let e = i.time, t = Object.fromEntries(pt.map((t) => [t, ht(i, t, e.length, n)]));
		for (let [r, i] of e.entries()) {
			let e = R(i);
			if (e === null) {
				n.push(`daily.time[${r}] is not a number`);
				continue;
			}
			c.push({
				time: e,
				temperatureMax: R(t.temperature_2m_max[r]),
				temperatureMin: R(t.temperature_2m_min[r]),
				weatherCode: R(t.weather_code[r]),
				precipitationProbabilityMax: R(t.precipitation_probability_max[r]),
				sunrise: R(t.sunrise[r]),
				sunset: R(t.sunset[r])
			});
		}
	}
	if (s.length === 0) throw new B(`no usable hourly data: ${n.join("; ")}`);
	return {
		hourly: s,
		daily: c,
		units: {
			temperature: z(e.hourly_units, "temperature_2m", ""),
			windSpeed: z(e.hourly_units, "wind_speed_10m", ""),
			precipitation: z(e.hourly_units, "precipitation", "")
		},
		timezone: typeof e.timezone == "string" ? e.timezone : "UTC",
		utcOffsetSeconds: R(e.utc_offset_seconds) ?? 0,
		gridLatitude: R(e.latitude) ?? NaN,
		gridLongitude: R(e.longitude) ?? NaN,
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
async function V(e, t, n = {}) {
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
async function wt(e, t = {}) {
	return _t(await V(e.hosts, (t) => mt(t, e), t), e.model);
}
async function Tt(e, t = {}) {
	return tt(await V(e.hosts, (t) => qe(t, e.alert_country), t));
}
async function Et(e, t, n = {}) {
	try {
		return Ze(await V(e, (e) => Je(e, t), n));
	} catch {
		return null;
	}
}
//#endregion
//#region src/types.ts
var Dt = {
	metro: 9,
	state: 5.79
}, Ot = ["https://data2.weatherwise.app", "https://data1.weatherwise.app"], kt = "https://web.weatherwise.app", At = [
	"RADAR",
	"COMPOSITE",
	"SATELLITE",
	"MODEL",
	"OUTLOOKS"
], jt = [
	"rt",
	"rp",
	"sid",
	"sr",
	"sp",
	"cid",
	"cr",
	"cp",
	"mid",
	"mr",
	"mn",
	"mp",
	"oid",
	"ost",
	"watermark",
	"ui_drawer"
], Mt = new Set(jt), Nt = /^[A-Za-z0-9_./-]{1,80}$/;
function Pt(e) {
	return Mt.has(e);
}
function Ft(e, t) {
	return Number(e.toFixed(t)).toString();
}
function It(e) {
	let t = [`map=${Ft(e.zoom, 2)}/${Ft(e.map_latitude, 4)}/${Ft(e.map_longitude, 4)}`, `m=${e.map_mode}`];
	for (let n of jt) {
		let r = e.map_params[n];
		r !== void 0 && t.push(`${n}=${r}`);
	}
	return e.map_ui || t.push("ui=0"), e.map_autoplay && t.push("autoplay=1"), `${kt}/#${t.join("&")}`;
}
function Lt(e) {
	let t;
	try {
		t = new URL(e.trim());
	} catch {
		return "is not a URL";
	}
	if (t.origin !== "https://web.weatherwise.app") return `must start with ${kt}`;
	let n = new URLSearchParams(t.hash.replace(/^#/, "")), r = { params: {} }, i = n.get("m")?.toUpperCase();
	if (i !== void 0) {
		if (!At.includes(i)) return `has an unknown mode "${i}"`;
		r.mode = i;
	}
	let a = n.get("map");
	if (a !== null) {
		let [e, t, n] = a.split("/").map(Number);
		e !== void 0 && t !== void 0 && n !== void 0 && Number.isFinite(e) && Number.isFinite(t) && Number.isFinite(n) && e >= 1 && e <= 18 && Math.abs(t) <= 90 && Math.abs(n) <= 180 && (r.camera = {
			zoom: e,
			latitude: t,
			longitude: n
		});
	}
	for (let [e, t] of n.entries()) e !== "mn" && Pt(e) && Nt.test(t) && (r.params[e] = t);
	return r;
}
//#endregion
//#region src/config.ts
var Rt = /* @__PURE__ */ new Set(/* @__PURE__ */ "type.title.latitude.longitude.view.zoom.map_mode.map_url.map_url_camera.map_params.composite_product.satellite.satellite_product.model_source.model_field.show_map.map_height.map_reload_minutes.map_interactive.map_ui.map_autoplay.show_conditions.show_hourly.hourly_count.show_daily.daily_count.model.temperature_unit.wind_speed_unit.precipitation_unit.refresh_minutes.hosts.layout.show_alerts.alerts_refresh_minutes.alerts_max.alerts_include_outlooks.alert_zones.alert_country.view_layout.layout_options.grid_options.visibility".split(".")), zt = /* @__PURE__ */ new Set(["metro", "state"]), Bt = /* @__PURE__ */ new Set(["ecmwf_ifs025", "gfs_seamless"]), Vt = /* @__PURE__ */ new Set(["fahrenheit", "celsius"]), Ht = /* @__PURE__ */ new Set([
	"mph",
	"kmh",
	"ms",
	"kn"
]), Ut = /* @__PURE__ */ new Set(["mm", "inch"]), Wt = /* @__PURE__ */ new Set(["strips", "report"]), Gt = new Set(At), Kt = [
	{
		option: "composite_product",
		param: "cp",
		mode: "COMPOSITE"
	},
	{
		option: "satellite",
		param: "sid",
		mode: "SATELLITE"
	},
	{
		option: "satellite_product",
		param: "sp",
		mode: "SATELLITE"
	},
	{
		option: "model_source",
		param: "mid",
		mode: "MODEL"
	},
	{
		option: "model_field",
		param: "mp",
		mode: "MODEL"
	}
];
function qt(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function H(e, t, n, r) {
	let i = e[t];
	return i === void 0 ? (r.required && n.push(`${t}: required`), r.fallback) : typeof i != "number" || !Number.isFinite(i) ? (n.push(`${t}: must be a number`), r.fallback) : r.integer && !Number.isInteger(i) ? (n.push(`${t}: must be a whole number`), r.fallback) : r.min !== void 0 && i < r.min ? (n.push(`${t}: must be at least ${r.min}`), r.fallback) : r.max !== void 0 && i > r.max ? (n.push(`${t}: must be at most ${r.max}`), r.fallback) : i;
}
function U(e, t, n, r) {
	let i = e[t];
	return i === void 0 ? r : typeof i == "boolean" ? i : (n.push(`${t}: must be true or false`), r);
}
function W(e, t, n, r, i) {
	let a = e[t];
	return a === void 0 ? i : typeof a != "string" || !n.has(a) ? (r.push(`${t}: must be one of ${[...n].join(", ")}`), i) : a;
}
function Jt(e, t) {
	let n = e.hosts;
	if (n === void 0) return [...Ot];
	if (!Array.isArray(n) || n.length === 0) return t.push("hosts: must be a non-empty list of https origins"), [...Ot];
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
	return r.length > 0 ? r : [...Ot];
}
function Yt(e, t) {
	let n = e.alert_zones;
	if (n == null || n === "") return [];
	let r;
	if (typeof n == "string") r = n.split(/[\s,]+/).filter((e) => e !== "");
	else if (Array.isArray(n)) r = n;
	else return t.push("alert_zones: must be a list of UGC codes such as TXZ133"), [];
	let i = [];
	for (let [e, n] of r.entries()) {
		if (typeof n != "string" || !Ge.test(n.trim().toUpperCase())) {
			t.push(`alert_zones[${e}]: "${String(n)}" is not a UGC code such as TXZ133 or TXC139`);
			continue;
		}
		i.push(n.trim().toUpperCase());
	}
	return i;
}
function Xt(e) {
	let t = [];
	if (!qt(e)) return { errors: ["configuration must be a mapping"] };
	for (let n of Object.keys(e)) Rt.has(n) || t.push(`${n}: unknown option`);
	e.title !== void 0 && typeof e.title != "string" && t.push("title: must be a string");
	let n = H(e, "latitude", t, {
		min: -90,
		max: 90,
		required: !0
	}), r = H(e, "longitude", t, {
		min: -180,
		max: 180,
		required: !0
	}), i = W(e, "view", zt, t, "metro"), a = H(e, "zoom", t, {
		min: 1,
		max: 18,
		fallback: Dt[i]
	}), o = { params: {} };
	if (e.map_url !== void 0 && e.map_url !== null && e.map_url !== "") {
		let n = typeof e.map_url == "string" ? Lt(e.map_url) : "must be a string";
		typeof n == "string" ? t.push(`map_url: ${n}`) : o = n;
	}
	let s = o.mode ?? "RADAR";
	e.map_mode !== void 0 && (typeof e.map_mode != "string" || !Gt.has(e.map_mode) ? t.push(`map_mode: must be one of ${At.join(", ")}`) : s = e.map_mode);
	let c = { ...o.params };
	if (e.map_params !== void 0 && e.map_params !== null) {
		if (!qt(e.map_params)) t.push("map_params: must be a mapping of WeatherWise URL parameters");
		else for (let [n, r] of Object.entries(e.map_params)) Pt(n) ? typeof r != "string" && typeof r != "number" || !Nt.test(String(r)) ? t.push(`map_params.${n}: must be a plain token`) : c[n] = String(r) : t.push(`map_params.${n}: not a supported parameter`);
	}
	for (let { option: n, param: r, mode: i } of Kt) {
		let a = e[n];
		a != null && a !== "" && (typeof a != "string" || !Nt.test(a) ? t.push(`${n}: must be a plain token`) : i === s && (c[r] = a));
	}
	let l = U(e, "map_url_camera", t, !1) && o.camera !== void 0 ? o.camera : void 0, u = "USA";
	e.alert_country !== void 0 && (typeof e.alert_country != "string" || !Ke.test(e.alert_country) ? t.push("alert_country: must be an upper-case country token such as USA") : u = e.alert_country);
	let d = {
		title: typeof e.title == "string" ? e.title : void 0,
		latitude: n ?? 0,
		longitude: r ?? 0,
		view: i,
		zoom: l?.zoom ?? a ?? Dt[i],
		map_mode: s,
		map_latitude: l?.latitude ?? n ?? 0,
		map_longitude: l?.longitude ?? r ?? 0,
		map_params: c,
		show_map: U(e, "show_map", t, !0),
		map_height: H(e, "map_height", t, {
			min: 120,
			max: 4e3,
			integer: !0,
			fallback: 480
		}) ?? 480,
		map_reload_minutes: H(e, "map_reload_minutes", t, {
			min: 0,
			max: 1440,
			integer: !0,
			fallback: 0
		}) ?? 0,
		map_interactive: U(e, "map_interactive", t, !1),
		map_ui: U(e, "map_ui", t, !1),
		map_autoplay: U(e, "map_autoplay", t, !0),
		show_conditions: U(e, "show_conditions", t, !0),
		show_hourly: U(e, "show_hourly", t, !0),
		hourly_count: H(e, "hourly_count", t, {
			min: 1,
			max: 48,
			integer: !0,
			fallback: 12
		}) ?? 12,
		show_daily: U(e, "show_daily", t, !1),
		daily_count: H(e, "daily_count", t, {
			min: 1,
			max: 16,
			integer: !0,
			fallback: 5
		}) ?? 5,
		model: W(e, "model", Bt, t, "ecmwf_ifs025"),
		temperature_unit: W(e, "temperature_unit", Vt, t, "fahrenheit"),
		wind_speed_unit: W(e, "wind_speed_unit", Ht, t, "mph"),
		precipitation_unit: W(e, "precipitation_unit", Ut, t, "inch"),
		refresh_minutes: H(e, "refresh_minutes", t, {
			min: 10,
			max: 1440,
			integer: !0,
			fallback: 30
		}) ?? 30,
		hosts: Jt(e, t),
		layout: W(e, "layout", Wt, t, "strips"),
		show_alerts: U(e, "show_alerts", t, !0),
		alerts_refresh_minutes: H(e, "alerts_refresh_minutes", t, {
			min: 2,
			max: 60,
			integer: !0,
			fallback: 5
		}) ?? 5,
		alerts_max: H(e, "alerts_max", t, {
			min: 1,
			max: 10,
			integer: !0,
			fallback: 3
		}) ?? 3,
		alerts_include_outlooks: U(e, "alerts_include_outlooks", t, !1),
		alert_zones: Yt(e, t),
		alert_country: u
	};
	return t.length > 0 ? { errors: t } : {
		config: d,
		errors: t
	};
}
function Zt(e) {
	return e.show_conditions || e.show_hourly || e.show_daily;
}
//#endregion
//#region src/conditions.ts
var Qt = {
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
function G(e, t) {
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
		label: Qt[r]
	};
}
function $t(e) {
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
var K = (e) => ({
	name: "",
	type: "grid",
	flatten: !0,
	schema: e
}), en = [
	{
		name: "title",
		selector: { text: {} }
	},
	K([{
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
	K([{
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
		schema: [
			K([
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
					selector: { select: {
						mode: "dropdown",
						options: [
							{
								value: "RADAR",
								label: "Radar (single site)"
							},
							{
								value: "COMPOSITE",
								label: "Composite (MRMS mosaic)"
							},
							{
								value: "SATELLITE",
								label: "Satellite"
							},
							{
								value: "MODEL",
								label: "Model"
							},
							{
								value: "OUTLOOKS",
								label: "Outlooks"
							}
						]
					} }
				}
			]),
			K([
				{
					name: "composite_product",
					selector: { select: {
						mode: "dropdown",
						options: [
							{
								value: "SeamlessHSR",
								label: "Reflectivity"
							},
							{
								value: "SeamlessHSRPRT",
								label: "Precipitation type"
							},
							{
								value: "VIL",
								label: "Vertically integrated liquid"
							},
							{
								value: "EchoTop_18",
								label: "Echo top (18 dBZ)"
							},
							{
								value: "MESH",
								label: "Max hail size (MESH)"
							},
							{
								value: "MESH_Max_60min",
								label: "Hail swath, 1 hour"
							},
							{
								value: "RotationTrack60min",
								label: "Rotation track, 1 hour"
							},
							{
								value: "CREF_1HR_MAX",
								label: "Composite reflectivity, hourly max"
							}
						]
					} }
				},
				{
					name: "satellite",
					selector: { select: {
						mode: "dropdown",
						options: [{
							value: "GOES-19",
							label: "GOES East"
						}, {
							value: "GOES-18",
							label: "GOES West"
						}]
					} }
				},
				{
					name: "satellite_product",
					selector: { select: {
						mode: "dropdown",
						options: [
							{
								value: "RGB-geo_color",
								label: "GeoColor"
							},
							{
								value: "RGB-true_color",
								label: "True color"
							},
							{
								value: "ABI-L1b-C02",
								label: "Visible (Band 2)"
							},
							{
								value: "ABI-L1b-C13",
								label: "Clean IR (Band 13)"
							},
							{
								value: "ABI-L1b-C09",
								label: "Mid-level water vapor (Band 9)"
							},
							{
								value: "RGB-sandwich",
								label: "Sandwich"
							},
							{
								value: "RGB-air_mass",
								label: "Air mass"
							},
							{
								value: "RGB-day_convection",
								label: "Day convection"
							}
						]
					} }
				},
				{
					name: "model_source",
					selector: { select: {
						mode: "dropdown",
						options: [
							{
								value: "HRRR",
								label: "HRRR"
							},
							{
								value: "NAM-NEST",
								label: "NAM Nest"
							},
							{
								value: "RAP",
								label: "RAP"
							},
							{
								value: "GFS",
								label: "GFS"
							},
							{
								value: "ECMWF-IFS",
								label: "ECMWF IFS"
							},
							{
								value: "NBM",
								label: "NBM"
							}
						]
					} }
				},
				{
					name: "model_field",
					selector: { select: {
						mode: "dropdown",
						options: [{
							value: "REFC_0_atmosphere_instant",
							label: "Composite reflectivity"
						}, {
							value: "CAPE_0_surface_instant",
							label: "Surface CAPE"
						}]
					} }
				}
			]),
			{
				name: "map_url",
				selector: { text: {} }
			},
			K([{
				name: "map_url_camera",
				selector: { boolean: {} }
			}]),
			K([{
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
			}])
		]
	},
	{
		name: "",
		type: "expandable",
		flatten: !0,
		title: "Forecast",
		schema: [
			K([
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
			K([
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
			K([
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
			K([{
				name: "show_alerts",
				selector: { boolean: {} }
			}, {
				name: "alerts_include_outlooks",
				selector: { boolean: {} }
			}]),
			K([{
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
			K([{
				name: "alert_zones",
				selector: { text: {} }
			}, {
				name: "alert_country",
				selector: { text: {} }
			}])
		]
	}
], tn = {
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
	composite_product: "Composite product",
	satellite: "Satellite",
	satellite_product: "Satellite product",
	model_source: "Model",
	model_field: "Model field",
	map_url: "Paste a WeatherWise URL (optional)",
	map_url_camera: "Use the pasted URL's position and zoom",
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
}, nn = {
	layout: "Strips show one tile per hour and day. Report shows tables with feels-like, rain amount, wind, humidity, sunrise and sunset.",
	show_alerts: "Warnings, watches, advisories, and statements from the WeatherWise warnings feed that cover this point, matched by polygon or by the zone codes below.",
	alerts_include_outlooks: "Off by default: Hazardous Weather Outlooks, Hydrologic Outlooks, and Short Term Forecasts are routine products, not hazards.",
	alert_zones: "NWS UGC codes for this point, comma separated, such as TXZ133 or TXC139. A listed code matches without a polygon lookup; leave empty to rely on the polygon test alone.",
	alert_country: "The country token in the feed path. Only USA is verified.",
	view: "Metro centers tightly on the point; State pulls back to the whole state. Set zoom to override.",
	map_interactive: "Off by default for display boards: a stray touch or wheel event would otherwise pan or zoom the map away until the next reload.",
	map_ui: "Off by default: the app then hides its mode selector, buttons, and the App Updates announcement that otherwise covers the map on a kiosk.",
	map_mode: "What the embedded map shows. The product choices below apply only in their own mode; leave them empty for the app's default.",
	composite_product: "Used in Composite mode. Empty shows reflectivity.",
	satellite_product: "Used in Satellite mode. Empty shows GeoColor.",
	model_source: "Used in Model mode. Empty shows HRRR; the latest run is always loaded.",
	model_field: "Used in Model mode. Field ids differ between models; for others, set the view in the WeatherWise app and paste its URL below.",
	map_url: "Set up any view in the WeatherWise app, copy the address, and paste it here. The card takes the mode and layer from it. Choices made above override it.",
	map_url_camera: "Off: the map stays centered on this card's latitude, longitude, and zoom. On: it uses the pasted URL's framing; the forecast and alerts still use the card's point.",
	map_reload_minutes: "0 never reloads. A periodic reload guards a kiosk against a stuck embedded page.",
	refresh_minutes: "Minimum 10 minutes. Forecast data is modeled, not measured; it changes on model runs, not by the minute."
};
function rn() {
	return {
		schema: en,
		computeLabel: (e) => tn[e.name],
		computeHelper: (e) => nn[e.name]
	};
}
//#endregion
//#region src/format.ts
function an(e, t, n) {
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
function on(e, t, n) {
	try {
		return new Intl.DateTimeFormat(n, {
			weekday: "short",
			timeZone: t
		}).format(/* @__PURE__ */ new Date(e * 1e3));
	} catch {
		return (/* @__PURE__ */ new Date(e * 1e3)).toISOString().slice(0, 10);
	}
}
function sn(e, t, n) {
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
function cn(e) {
	let t = Math.round(e / 6e4);
	return t < 1 ? "just now" : t < 60 ? `${t} min ago` : `${Math.floor(t / 60)} h ${t % 60} min ago`;
}
function J(e, t = 0) {
	return e === null || !Number.isFinite(e) ? "--" : e.toFixed(t);
}
//#endregion
//#region src/icons.ts
var ln = T`<circle cx="12" cy="12" r="4" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="4.5"/><line x1="12" y1="19.5" x2="12" y2="22"/><line x1="2" y1="12" x2="4.5" y2="12"/><line x1="19.5" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="6.7" y2="6.7"/><line x1="17.3" y1="17.3" x2="19.1" y2="19.1"/><line x1="4.9" y1="19.1" x2="6.7" y2="17.3"/><line x1="17.3" y1="6.7" x2="19.1" y2="4.9"/></g>`, un = T`<path fill="currentColor" d="M14.5 2.5a9.5 9.5 0 1 0 7 15.6A8 8 0 0 1 14.5 2.5z"/>`, dn = T`<path fill="currentColor" d="M6.5 19a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 17.6 9.1 4 4 0 0 1 17.5 19H6.5z"/>`, fn = T`<path fill="currentColor" d="M9 20a3.5 3.5 0 0 1-.5-6.96A5 5 0 0 1 18.2 12 3.2 3.2 0 0 1 18 20H9z"/>`, pn = (e) => T`<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="${e}" x2="7" y2="${e + 3}"/><line x1="12" y1="${e}" x2="11" y2="${e + 3}"/><line x1="16" y1="${e}" x2="15" y2="${e + 3}"/></g>`, Y = T`<path fill="currentColor" d="M6.5 15a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 16.6 6 3.6 3.6 0 0 1 17.2 15H6.5z"/>`, mn = {
	"clear-day": ln,
	"clear-night": un,
	"partly-cloudy-day": T`<g transform="translate(-3 -3) scale(0.8)">${ln}</g>${fn}`,
	"partly-cloudy-night": T`<g transform="translate(-2 -3) scale(0.7)">${un}</g>${fn}`,
	cloudy: dn,
	fog: T`${Y}<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="18" x2="19" y2="18"/><line x1="7" y1="21.5" x2="17" y2="21.5"/></g>`,
	rain: T`${Y}${pn(18)}`,
	pouring: T`${Y}${pn(17)}<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="10" y1="21" x2="9.5" y2="23"/><line x1="14" y1="21" x2="13.5" y2="23"/></g>`,
	sleet: T`${Y}<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="18" x2="7" y2="21"/><line x1="16" y1="18" x2="15" y2="21"/></g><circle cx="12" cy="20" r="1.5" fill="currentColor"/>`,
	snow: T`${Y}<g fill="currentColor"><circle cx="8" cy="19" r="1.5"/><circle cx="12" cy="21.5" r="1.5"/><circle cx="16" cy="19" r="1.5"/></g>`,
	thunderstorm: T`${Y}<path fill="currentColor" d="M12.5 15.5 9.5 20h2.5l-1 3.5 3.5-5h-2.5z"/>`,
	hail: T`${Y}<path fill="currentColor" d="M11 15.5 8.5 19.5h2l-.8 3 3-4.5h-2z"/><circle cx="16" cy="19.5" r="1.6" fill="currentColor"/>`,
	unknown: T`<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><text x="12" y="16.5" text-anchor="middle" font-size="12" fill="currentColor">?</text>`
};
function X(e, t = 24) {
	return T`<svg viewBox="0 0 24 24" width="${t}" height="${t}" aria-hidden="true">${mn[e]}</svg>`;
}
//#endregion
//#region src/styles.ts
var hn = o`
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
var gn, Q = 6e4, _n = 2;
function vn(e) {
	return e instanceof St ? e.attempts.join("; ") : e.message;
}
var $ = class extends M {
	constructor(...e) {
		super(...e), this.loading = !1, this.now = Date.now(), this.mapGeneration = 0, this.unresolvedAlerts = [], this.forecastKey = "", this.alertsKey = "", this.alertsLoading = !1, this.geometryCache = /* @__PURE__ */ new Map();
	}
	setConfig(e) {
		let t = Xt(e);
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
		return rn();
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
			}, Q), Zt(this.config)) {
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
			let n = await Tt(e), r = new Set(n.map((e) => e.id));
			for (let e of this.geometryCache.keys()) r.has(e) || this.geometryCache.delete(e);
			let { matched: i, unresolved: a } = await dt(n, {
				latitude: e.latitude,
				longitude: e.longitude,
				zones: e.alert_zones,
				nowMs: Date.now(),
				includeOutlooks: e.alerts_include_outlooks,
				fetchGeometry: async (t) => {
					let n = this.geometryCache.get(t);
					if (n != null) return n;
					let r = await Et(e.hosts, t);
					return this.geometryCache.set(t, r), r;
				}
			});
			if (t !== this.alertsKey) return;
			this.alerts = i, this.unresolvedAlerts = a, this.alertsFetchedAt = Date.now(), this.alertsError = void 0;
		} catch (e) {
			if (t !== this.alertsKey) return;
			this.alertsError = vn(e);
		} finally {
			this.alertsLoading = !1, this.now = Date.now();
		}
	}
	async refresh() {
		if (!this.config || this.loading) return;
		this.loading = !0;
		let e = this.forecastKey;
		try {
			let t = await wt(this.config);
			if (e !== this.forecastKey) return;
			this.forecast = t, this.fetchedAt = Date.now(), this.lastError = void 0;
		} catch (t) {
			if (e !== this.forecastKey) return;
			this.lastError = vn(t);
		} finally {
			this.loading = !1, this.now = Date.now();
		}
	}
	locale() {
		return this._hass?.locale?.language ?? this._hass?.language;
	}
	render() {
		let e = this.config;
		return e ? w`
      <div class="card">
        ${this.renderHeader(e)}
        ${e.show_alerts ? this.renderAlerts(e) : D}
        ${e.show_map ? this.renderMap(e) : D}
        ${e.show_hourly ? e.layout === "report" ? this.renderHourlyReport(e) : this.renderHourly(e) : D}
        ${e.show_daily ? e.layout === "report" ? this.renderDailyReport(e) : this.renderDaily(e) : D}
        ${this.renderFooter(e)}
      </div>
    ` : w`<div class="card"><div class="problems">No configuration</div></div>`;
	}
	renderAlerts(e) {
		let t = this.alerts;
		if (!t || t.length === 0) return D;
		let n = this.forecast?.timezone, r = this.locale(), i = this.now / 1e3;
		return w`<div class="alerts" role="list">
      ${t.slice(0, e.alerts_max).map((e) => {
			let t = e.startsAt === null ? null : e.startsAt / 1e3, a = e.expiresAt === null ? null : e.expiresAt / 1e3, o = t !== null && t > i ? `from ${sn(t, n, r)}` : a === null ? "" : `until ${sn(a, n, r)}`;
			return w`<div class="alert sig-${e.significance} ${e.emergency ? "emergency" : ""}" role="listitem" title=${e.where ?? ""}>
          <span class="name">${e.title}</span>
          <span class="until">${o}</span>
          ${e.what ? w`<span class="what">${e.what}</span>` : D}
        </div>`;
		})}
    </div>`;
	}
	renderAlertStatus() {
		let e = [];
		return this.config?.show_alerts ? (this.alertsError ? e.push(w`<span class="badge error">alerts unavailable</span><span>${this.alertsError}</span>`) : this.alertsFetchedAt !== void 0 && this.alerts && e.push(w`<span>${this.alerts.length === 0 ? "no local alerts" : `${this.alerts.length} local alert${this.alerts.length === 1 ? "" : "s"}`}</span>`), this.unresolvedAlerts.length > 0 && e.push(w`<span class="badge stale">unresolved</span><span>${this.unresolvedAlerts.map((e) => e.title).join(", ")}: polygon unavailable, not shown</span>`), e) : e;
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
		if (!t) return D;
		let { f: n, rows: r } = t, i = this.locale();
		return w`<div class="report-wrap"><table class="report">
      <thead><tr>
        <th>Hour</th><th>Conditions</th><th class="num">Temp</th><th class="num">Feels</th>
        <th class="num">Rain</th><th class="num">Amount</th><th>Wind</th><th class="num">Humidity</th>
      </tr></thead>
      <tbody>
        ${r.map((e) => {
			let t = G(e.weatherCode, e.isDay);
			return w`<tr>
            <td>${an(e.time, n.timezone, i)}</td>
            <td><span class="cond"><span class="icon">${X(t.key, 20)}</span>${t.label}</span></td>
            <td class="num">${J(e.temperature)}${n.units.temperature}</td>
            <td class="num">${J(e.apparentTemperature)}${n.units.temperature}</td>
            <td class="num">${J(e.precipitationProbability)}%</td>
            <td class="num">${J(e.precipitation, 2)} ${n.units.precipitation}</td>
            <td>${J(e.windSpeed)} ${n.units.windSpeed} ${$t(e.windBearing)}</td>
            <td class="num">${J(e.humidity)}%</td>
          </tr>`;
		})}
      </tbody>
    </table></div>`;
	}
	renderDailyReport(e) {
		let t = this.forecast;
		if (!t || t.daily.length === 0) return D;
		let n = this.locale();
		return w`<div class="report-wrap"><table class="report">
      <thead><tr>
        <th>Day</th><th>Conditions</th><th class="num">High</th><th class="num">Low</th>
        <th class="num">Rain</th><th>Sunrise</th><th>Sunset</th>
      </tr></thead>
      <tbody>
        ${t.daily.slice(0, e.daily_count).map((e) => {
			let r = G(e.weatherCode, !0);
			return w`<tr>
            <td>${on(e.time, t.timezone, n)}</td>
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
		return w`
      <div class="header">
        <div class="title">${e.title ?? (e.view === "state" ? "State radar" : "Metro radar")}</div>
        ${e.show_conditions ? this.renderHeadline(e) : D}
      </div>
    `;
	}
	renderHeadline(e) {
		let t = this.forecast;
		if (!t) return w`<div class="meta">
        ${this.lastError ? w`<span class="badge error">unavailable</span><span>${this.lastError}</span>` : w`<span>Loading forecast</span>`}
      </div>`;
		let n = yt(t, Math.floor(this.now / 1e3), e.hourly_count), r = n.current;
		if (!r) return w`<div class="meta"><span class="badge stale">expired</span><span>Forecast window has passed; waiting for refresh</span></div>`;
		let i = G(r.weatherCode, r.isDay), a = this.locale(), o = bt([r, ...n.upcoming]);
		return w`
      <div class="headline">
        <span class="icon" title=${i.label}>${X(i.key, 44)}</span>
        <span class="temp">${J(r.temperature)}${t.units.temperature}</span>
        <div class="details">
          <span>${i.label}</span>
          <span>Feels <b>${J(r.apparentTemperature)}${t.units.temperature}</b></span>
          <span>Rain <b>${J(r.precipitationProbability)}%</b>${o !== null && o !== r.precipitationProbability ? w` (max ${J(o)}%)` : D}</span>
          <span>Wind <b>${J(r.windSpeed)} ${t.units.windSpeed}</b> ${$t(r.windBearing)}</span>
          <span>Humidity <b>${J(r.humidity)}%</b></span>
          <span>Valid <b>${an(r.time, t.timezone, a)}</b></span>
        </div>
      </div>
      ${this.renderStatus(e)}
    `;
	}
	renderStatus(e) {
		let t = [];
		if (this.fetchedAt !== void 0) {
			let n = this.now - this.fetchedAt;
			n > e.refresh_minutes * Q * _n && t.push(w`<span class="badge stale">stale</span>`), t.push(w`<span>fetched ${cn(n)}</span>`);
		}
		return this.lastError && t.push(w`<span class="badge error">refresh failed</span><span>${this.lastError}</span>`), t.push(...this.renderAlertStatus()), w`<div class="meta">${t}</div>`;
	}
	renderMap(e) {
		let t = It(e);
		return w`
      <div class="map ${e.map_interactive ? "" : "locked"}" style="height:${e.map_height}px">
        ${We(this.mapGeneration, w`<iframe
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
		if (!t) return D;
		let { f: n, rows: r } = t, i = this.locale();
		return w`<div class="strip">
      ${r.map((e) => {
			let t = G(e.weatherCode, e.isDay);
			return w`<div class="tile">
          <span class="when">${an(e.time, n.timezone, i)}</span>
          <span class="icon" title=${t.label}>${X(t.key, 26)}</span>
          <span>${J(e.temperature)}${n.units.temperature}</span>
          <span class="rain">${J(e.precipitationProbability)}%</span>
        </div>`;
		})}
    </div>`;
	}
	renderDaily(e) {
		let t = this.forecast;
		if (!t || t.daily.length === 0) return D;
		let n = this.locale();
		return w`<div class="strip">
      ${t.daily.slice(0, e.daily_count).map((e) => {
			let r = G(e.weatherCode, !0);
			return w`<div class="tile">
          <span class="when">${on(e.time, t.timezone, n)}</span>
          <span class="icon" title=${r.label}>${X(r.key, 26)}</span>
          <span>${J(e.temperatureMax)}${t.units.temperature} <span class="lo">${J(e.temperatureMin)}${t.units.temperature}</span></span>
          <span class="rain">${J(e.precipitationProbabilityMax)}%</span>
        </div>`;
		})}
    </div>`;
	}
	renderFooter(e) {
		let t = this.forecast, n = t?.daily[0], r = this.locale();
		return w`<div class="footer">
      <span>
        <a href=${It(e)} target="_blank" rel="noopener noreferrer">WeatherWise</a>
        ${t ? w` · ${t.model === "gfs_seamless" ? "GFS" : "ECMWF"} model, grid ${J(t.gridLatitude, 2)}, ${J(t.gridLongitude, 2)}` : D}
      </span>
      ${n && n.sunrise !== null && n.sunset !== null && t ? w`<span>Sunrise ${q(n.sunrise, t.timezone, r)} · Sunset ${q(n.sunset, t.timezone, r)}</span>` : D}
    </div>`;
	}
};
gn = $, gn.styles = [hn, o`
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
    `], Z([Re({ attribute: !1 })], $.prototype, "config", void 0), Z([N()], $.prototype, "forecast", void 0), Z([N()], $.prototype, "fetchedAt", void 0), Z([N()], $.prototype, "lastError", void 0), Z([N()], $.prototype, "loading", void 0), Z([N()], $.prototype, "now", void 0), Z([N()], $.prototype, "mapGeneration", void 0), Z([N()], $.prototype, "alerts", void 0), Z([N()], $.prototype, "unresolvedAlerts", void 0), Z([N()], $.prototype, "alertsFetchedAt", void 0), Z([N()], $.prototype, "alertsError", void 0), customElements.define("weatherwise-card", $), window.customCards = window.customCards ?? [], window.customCards.push({
	type: "weatherwise-card",
	name: "WeatherWise Card",
	description: "Embedded WeatherWise radar map at metro or state zoom with a modeled-conditions headline, local alerts, and hourly and daily forecast strips or tables. Built for kiosk displays.",
	documentationURL: "https://github.com/trooperthorn/ha_card_weatherwise"
}), console.info("%c WEATHERWISE-CARD %c v2026.09.30.4 ", "background: #444; color: #fff; border-radius: 3px 0 0 3px; padding: 2px 0;", "background: #38bdf8; color: #111; border-radius: 0 3px 3px 0; padding: 2px 0;");
//#endregion
export { $ as WeatherWiseCard };
