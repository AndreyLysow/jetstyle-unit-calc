'use client';
import Image from 'next/image';
import styles from '../styles/Hero.module.scss';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`${styles.in} container`}>
        {/* Текст (слева на десктопе) */}
        <div className={styles.text}>
          <h1 className={styles.title}>
            <span className={styles.line}>Калькулятор</span>
            <span className={styles.line}>unit-</span>
            <span className={styles.line}>экономики</span>
          </h1>
          <p className={styles.sub}>
            Это мини-версия калькулятора, созданная нами чтобы иметь возможность
            наглядно пояснить концепцию юнит-экономики, и быстро на примерах
            провалидировать гипотезы о том, сходится ли бизнес-модель в каком-либо
            конкретном рекламном канале.
          </p>
        </div>

        {/* Картинка (справа на десктопе / сверху на мобиле) */}
        <div className={styles.art} aria-hidden>
          <Image src="/Rectangle.png" alt="" width={586} height={586} priority />
        </div>
      </div>
    </section>
  );
}