import assert from "assert";
import Random from "./index.js";

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (e) {
    failed++;
    console.log(`  ❌ ${name}: ${e.message}`);
  }
}

function assertInRange(val, min, max) {
  assert.ok(val >= min && val < max, `Expected ${val} in [${min}, ${max})`);
}

// =============================================
// 1. 构造函数测试
// =============================================
console.log("\n📦 构造函数");

test("不传种子应自动生成", () => {
  const r = new Random();
  assert.ok(typeof r.getSeed() === "string");
  assert.ok(r.getSeed().length > 0);
});

test("传入字符串种子", () => {
  const r = new Random("hello");
  assert.strictEqual(r.getSeed(), "hello");
});

test("传入数字种子", () => {
  const r = new Random(42);
  assert.strictEqual(r.getSeed(), "42");
});

test("传入空字符串种子", () => {
  const r = new Random("");
  assert.strictEqual(r.getSeed(), "");
});

test("传入 0 作为种子", () => {
  const r = new Random(0);
  assert.strictEqual(r.getSeed(), "0");
});

// =============================================
// 2. 确定性与可重现性
// =============================================
console.log("\n🎯 确定性与可重现性");

test("相同种子产生相同序列", () => {
  const r1 = new Random("test");
  const r2 = new Random("test");
  for (let i = 0; i < 100; i++) {
    assert.strictEqual(r1.float(), r2.float());
  }
});

test("不同种子产生不同序列", () => {
  const r1 = new Random("aaa");
  const r2 = new Random("bbb");
  let same = 0;
  for (let i = 0; i < 100; i++) {
    if (r1.float() === r2.float()) same++;
  }
  assert.ok(same < 100, "不同种子不应完全相同");
});

test("reset 后序列重现", () => {
  const r = new Random("reset-test");
  const first = [];
  for (let i = 0; i < 10; i++) first.push(r.float());
  r.reset();
  for (let i = 0; i < 10; i++) {
    assert.strictEqual(r.float(), first[i]);
  }
});

// =============================================
// 3. float() 测试
// =============================================
console.log("\n🔢 float()");

test("返回值在 [0, 1) 范围内", () => {
  const r = new Random("float-test");
  for (let i = 0; i < 1000; i++) {
    const val = r.float();
    assert.ok(val >= 0 && val < 1, `值 ${val} 不在 [0, 1) 范围内`);
  }
});

test("返回值分布均匀（均值接近 0.5）", () => {
  const r = new Random("float-dist");
  let sum = 0;
  const N = 100000;
  for (let i = 0; i < N; i++) sum += r.float();
  const mean = sum / N;
  assert.ok(Math.abs(mean - 0.5) < 0.01, `均值 ${mean} 偏离 0.5 过大`);
});

// =============================================
// 4. range() 测试
// =============================================
console.log("\n📏 range()");

test("返回值在 [min, max) 范围内", () => {
  const r = new Random("range-test");
  for (let i = 0; i < 1000; i++) {
    const val = r.range(5, 10);
    assertInRange(val, 5, 10);
  }
});

test("支持负数范围", () => {
  const r = new Random("range-neg");
  for (let i = 0; i < 1000; i++) {
    const val = r.range(-10, 0);
    assertInRange(val, -10, 0);
  }
});

test("min 等于 max 时返回 min", () => {
  const r = new Random("range-eq");
  for (let i = 0; i < 100; i++) {
    assert.strictEqual(r.range(5, 5), 5);
  }
});

// =============================================
// 5. int() 测试
// =============================================
console.log("\n🔢 int()");

test("返回值在 [min, max] 范围内（整数）", () => {
  const r = new Random("int-test");
  for (let i = 0; i < 1000; i++) {
    const val = r.int(1, 6);
    assert.ok(val >= 1 && val <= 6, `值 ${val} 不在 [1, 6] 范围内`);
    assert.strictEqual(val, Math.floor(val), `值 ${val} 不是整数`);
  }
});

test("骰子模拟：各面出现概率均匀", () => {
  const r = new Random("int-dice");
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const N = 60000;
  for (let i = 0; i < N; i++) {
    counts[r.int(1, 6)]++;
  }
  for (const face of [1, 2, 3, 4, 5, 6]) {
    const pct = counts[face] / N;
    assert.ok(
      Math.abs(pct - 1 / 6) < 0.01,
      `面 ${face} 出现概率 ${pct} 偏离期望 1/6 过大`,
    );
  }
});

// =============================================
// 6. bool() 测试
// =============================================
console.log("\n✅ bool()");

test("默认概率为 0.5", () => {
  const r = new Random("bool-default");
  let trues = 0;
  const N = 10000;
  for (let i = 0; i < N; i++) {
    if (r.bool()) trues++;
  }
  const pct = trues / N;
  assert.ok(Math.abs(pct - 0.5) < 0.03, `true 概率 ${pct} 偏离 0.5 过大`);
});

test("指定概率 0.8", () => {
  const r = new Random("bool-08");
  let trues = 0;
  const N = 10000;
  for (let i = 0; i < N; i++) {
    if (r.bool(0.8)) trues++;
  }
  const pct = trues / N;
  assert.ok(Math.abs(pct - 0.8) < 0.03, `true 概率 ${pct} 偏离 0.8 过大`);
});

test("概率为 0 时永远 false", () => {
  const r = new Random("bool-0");
  for (let i = 0; i < 100; i++) {
    assert.strictEqual(r.bool(0), false);
  }
});

test("概率为 1 时永远 true", () => {
  const r = new Random("bool-1");
  for (let i = 0; i < 100; i++) {
    assert.strictEqual(r.bool(1), true);
  }
});

// =============================================
// 7. pick() 测试
// =============================================
console.log("\n🎯 pick()");

test("从数组中随机选取一个元素", () => {
  const r = new Random("pick-test");
  const arr = ["a", "b", "c", "d"];
  for (let i = 0; i < 100; i++) {
    const picked = r.pick(arr);
    assert.ok(arr.includes(picked), `选取的值 ${picked} 不在数组中`);
  }
});

test("单元素数组", () => {
  const r = new Random("pick-one");
  assert.strictEqual(r.pick([42]), 42);
});

test("空数组应返回 undefined", () => {
  const r = new Random("pick-empty");
  assert.strictEqual(r.pick([]), undefined);
});

// =============================================
// 8. shuffle() 测试
// =============================================
console.log("\n🔀 shuffle()");

test("返回新数组，不修改原数组", () => {
  const r = new Random("shuffle-original");
  const original = [1, 2, 3, 4, 5];
  const shuffled = r.shuffle(original);
  assert.notStrictEqual(shuffled, original);
  assert.deepStrictEqual(original, [1, 2, 3, 4, 5]);
});

test("打乱后元素不变（只是顺序变了）", () => {
  const r = new Random("shuffle-elements");
  const original = [1, 2, 3, 4, 5];
  const shuffled = r.shuffle(original);
  assert.deepStrictEqual(shuffled.sort(), original);
});

test("单元素数组打乱后不变", () => {
  const r = new Random("shuffle-one");
  assert.deepStrictEqual(r.shuffle([42]), [42]);
});

test("空数组打乱后仍为空", () => {
  const r = new Random("shuffle-empty");
  assert.deepStrictEqual(r.shuffle([]), []);
});

// =============================================
// 9. getSeed() 测试
// =============================================
console.log("\n🏷️  getSeed()");

test("返回构造时传入的种子", () => {
  const r = new Random("my-seed");
  assert.strictEqual(r.getSeed(), "my-seed");
});

test("不传种子时返回自动生成的 UUID", () => {
  const r = new Random();
  const seed = r.getSeed();
  // UUID 格式: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  assert.ok(/^[0-9a-f-]+$/.test(seed));
  assert.strictEqual(seed.length, 36);
});

// =============================================
// 10. reset() 测试
// =============================================
console.log("\n🔄 reset()");

test("reset 后从头开始生成", () => {
  const r = new Random("reset-seq");
  const seq1 = [];
  for (let i = 0; i < 5; i++) seq1.push(r.float());
  r.reset();
  for (let i = 0; i < 5; i++) {
    assert.strictEqual(r.float(), seq1[i]);
  }
});

test("多次 reset 结果一致", () => {
  const r = new Random("multi-reset");
  const first = r.float();
  for (let i = 0; i < 10; i++) {
    r.reset();
    assert.strictEqual(r.float(), first);
  }
});

// =============================================
// 11. 私有方法保护测试
// =============================================
console.log("\n🔒 私有方法保护");

test("实例无法调用 _hashSeed", () => {
  const r = new Random("private");
  assert.strictEqual(r._hashSeed, undefined);
});

test("实例无法调用 _next", () => {
  const r = new Random("private");
  assert.strictEqual(r._next, undefined);
});

// =============================================
// 总结
// =============================================
console.log(`\n${"=".repeat(40)}`);
console.log(`总计: ${passed + failed} 个测试`);
console.log(`通过: ${passed} ✅`);
console.log(`失败: ${failed} ❌`);
console.log(`${"=".repeat(40)}`);

process.exit(failed > 0 ? 1 : 0);
