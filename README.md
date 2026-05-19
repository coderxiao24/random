# @xiaokaixuan/random

一个极简的伪随机数生成器（PRNG），支持自定义种子，不传种子则自动使用 UUID作为种子。

## 安装

```bash
npm install @xiaokaixuan/random
```

## 仓库

[https://github.com/coderxiao24/random](https://github.com/coderxiao24/random)

## 快速开始

```js
const Random = require("@xiaokaixuan/random");

// 不传种子，自动使用 UUID
const r1 = new Random();
console.log(r1.float()); // 0.423...

// 传入种子，保证可重现
const r2 = new Random("my-seed");
console.log(r2.int(1, 100)); // 55
console.log(r2.bool()); // false
```

## API

### `new Random(seed?)`

| 参数 | 类型               | 默认值    | 说明                             |
| ---- | ------------------ | --------- | -------------------------------- |
| seed | `string \| number` | 随机 UUID | 随机数种子，相同种子产生相同序列 |

### 实例方法

#### `float()`

返回 `[0, 1)` 之间的浮点数。

```js
r.float(); // 0.1309...
```

#### `range(min, max)`

返回 `[min, max)` 之间的浮点数。

```js
r.range(5, 10); // 7.342...
r.range(-10, 0); // -3.871...
```

#### `int(min, max)`

返回 `[min, max]` 之间的整数（包含两端）。

```js
r.int(1, 6); // 骰子：3
r.int(1, 100); // 42
```

#### `bool(likelihood?)`

返回布尔值，`true` 的概率为 `likelihood`（默认 0.5）。

```js
r.bool(); // 50% 概率 true
r.bool(0.8); // 80% 概率 true
r.bool(0); // 永远 false
r.bool(1); // 永远 true
```

#### `pick(arr)`

从数组中随机选取一个元素。

```js
r.pick(["苹果", "香蕉", "橘子"]); // '香蕉'
r.pick([42]); // 42
r.pick([]); // undefined
```

#### `shuffle(arr)`

打乱数组（Fisher-Yates 洗牌算法），**返回新数组，不修改原数组**。

```js
const arr = [1, 2, 3, 4, 5];
const shuffled = r.shuffle(arr);
// shuffled: [3, 1, 5, 2, 4]
// arr:      [1, 2, 3, 4, 5]  ← 原数组不变
```

#### `getSeed()`

获取当前种子。

```js
r.getSeed(); // 'my-seed'
```

#### `reset()`

重置生成器到初始状态，后续生成的随机数序列与构造后首次调用一致。

```js
const r = new Random("test");
r.float(); // 0.1309...
r.float(); // 0.8234...

r.reset();
r.float(); // 0.1309...  ← 与第一次相同
```

## 特性

- **种子可重现**：相同种子产生完全相同的随机数序列
- **自动种子**：不传种子时使用 `uuid` 生成随机种子
- **私有方法保护**：内部方法（`_hashSeed`、`_next`）使用 Symbol 实现真正的私有，实例无法调用
- **TypeScript 支持**：包含完整的类型定义文件
- **运行时仅依赖 `uuid`**：轻量，安装即用

## 算法

内部使用**线性同余生成器（LCG）**，参数来自《Numerical Recipes》：

```
X_{n+1} = (1664525 × X_n + 1013904223) mod 2^31
```

周期为 2^31 - 1（约 21 亿），具有良好的统计分布特性。

## 许可证

MIT
