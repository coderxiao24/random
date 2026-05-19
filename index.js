import { v4 as uuidv4 } from "uuid";

// 私有方法，使用 Symbol 确保外部无法直接访问
const _hashSeed = Symbol("hashSeed");
const _next = Symbol("next");

/**
 * 一个极简的伪随机数生成器 (PRNG)
 * 支持传入种子，不传则使用随机 UUID 作为种子
 */
class Random {
  /**
   * @param {string|number} [seed] - 随机数种子，不传则自动生成
   */
  constructor(seed) {
    this._seed = seed != null ? String(seed) : uuidv4();
    this[_hashSeed](this._seed);
  }

  /**
   * 将种子字符串哈希为一个 32 位整数状态
   * @param {string} str
   * @returns {number}
   */
  [_hashSeed](str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // 转换为 32 位整数
    }
    this._state = Math.abs(hash) || 1;
  }

  /**
   * 内部：生成下一个伪随机数（0 ~ 1 之间）
   * 使用线性同余生成器 (LCG)
   * @returns {number}
   */
  [_next]() {
    // 参数来自 Numerical Recipes
    this._state = (this._state * 1664525 + 1013904223) & 0x7fffffff;
    return this._state / 0x7fffffff;
  }

  /**
   * 返回 [0, 1) 之间的浮点数
   * @returns {number}
   */
  float() {
    return this[_next]();
  }

  /**
   * 返回 [min, max) 之间的浮点数
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  range(min, max) {
    return min + this[_next]() * (max - min);
  }

  /**
   * 返回 [min, max] 之间的整数
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  int(min, max) {
    return Math.floor(this.range(min, max + 1));
  }

  /**
   * 返回一个布尔值，true 的概率为 likelihood
   * @param {number} [likelihood=0.5]
   * @returns {boolean}
   */
  bool(likelihood = 0.5) {
    return this[_next]() < likelihood;
  }

  /**
   * 从数组中随机选取一个元素
   * @template T
   * @param {T[]} arr
   * @returns {T}
   */
  pick(arr) {
    return arr[this.int(0, arr.length - 1)];
  }

  /**
   * 打乱数组（Fisher-Yates 洗牌算法），返回新数组
   * @template T
   * @param {T[]} arr
   * @returns {T[]}
   */
  shuffle(arr) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * 获取当前种子
   * @returns {string}
   */
  getSeed() {
    return this._seed;
  }

  /**
   * 重置生成器到初始状态（使用构造时的种子）
   */
  reset() {
    this[_hashSeed](this._seed);
  }
}

export default Random;
