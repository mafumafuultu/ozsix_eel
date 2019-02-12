const flat = a => a.reduce((ta, v) => v instanceof Array ? Array.prototype.concat.call(ta, v) : (ta.push(v), ta), []);

const topicList = (name, o) => div.class('topicItem').$(
	...flat(Object.entries(o).map(
		([k, v]) => [radio.name(name).id(k).$(''), label.$(v).set({for: k})]
	))
);

const charList = o => Object.entries(o).map(
	([k, v]) => div.class('charItem').$(
		check(k, v).pick.class('check').outer.on('change'),
		button.mark(v).class('removeCharctor').on('click').$('DEL')
	)
);

const story = a => a.map(v => li.class(v[0]).$(v[1]));

const addTalk = (s, clz) => void $.id.story_board.$(li.class(clz).$(s));

const fill = (n, v) => ','.repeat(n - 1).split(',').fill(v);

const vec = (n, a, f) => a.reduce((base, v) => v.map((val, i) => f(base[i], val)), fill(n, 0));

const centerOfGravity = (n, a, f) => vec(n, a, f).map(v => v / a.length);
