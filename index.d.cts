/**
 * 一个极简的伪随机数生成器 (PRNG)
 * 支持传入种子，不传则使用随机 UUID 作为种子
 */
declare class Random {
  /**
   * @param seed - 随机数种子，不传则自动生成
   */
  constructor(seed?: string | number);

  /**
   * 返回 [0, 1) 之间的浮点数
   */
  float(): number;

  /**
   * 返回 [min, max) 之间的浮点数
   * @param min - 最小值
   * @param max - 最大值
   */
  range(min: number, max: number): number;

  /**
   * 返回 [min, max] 之间的整数
   * @param min - 最小值
   * @param max - 最大值
   */
  int(min: number, max: number): number;

  /**
   * 返回一个布尔值，true 的概率为 likelihood
   * @param likelihood - 返回 true 的概率，默认 0.5
   */
  bool(likelihood?: number): boolean;

  /**
   * 从数组中随机选取一个元素
   * @param arr - 源数组
   */
  pick<T>(arr: T[]): T;

  /**
   * 打乱数组（Fisher-Yates 洗牌算法），返回新数组
   * @param arr - 源数组
   */
  shuffle<T>(arr: T[]): T[];

  /**
   * 获取当前种子
   */
  getSeed(): string;

  /**
   * 重置生成器到初始状态（使用构造时的种子）
   */
  reset(): void;
}

export = Random;
