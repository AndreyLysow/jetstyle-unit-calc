'use client';
import Image from 'next/image';
import { useState } from 'react';
import styles from '../styles/Header.module.scss';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.header__in}>
        {/* Левое меню (десктоп) */}
        <nav className={styles.header__nav}>
          <ul>
            <li><a href="#">Мы</a></li>

            <li className={styles.withCaret}>
              <a href="#">Услуги</a>
              <span className={styles.caret}>
                <Image src="/arrowBLK.png" alt="" width={14} height={10} className={styles.caretBlk} />
                <Image src="/arrow.png"    alt="" width={14} height={10} className={styles.caretRed} />
              </span>
            </li>

            <li><a href="#">Работы</a></li>

            <li className={styles.withCaret}>
              <a href="#">Продукты</a>
              <span className={styles.caret}>
                <Image src="/arrowBLK.png" alt="" width={14} height={10} className={styles.caretBlk} />
                <Image src="/arrow.png"    alt="" width={14} height={10} className={styles.caretRed} />
              </span>
            </li>
          </ul>
        </nav>

        {/* Логотип */}
        <div className={styles.header__logo}>
          <Image src="/logo_white.png" alt="JetStyle" width={140} height={30} priority />
        </div>

        {/* Правый блок (десктоп) */}
        <div className={styles.header__right}>
          <a href="#" className={styles.header__link}>Услуги</a>
          <a href="tel:+78002569897" className={styles.header__phone}>8 800 256-98-97</a>
          <button className={styles.searchBtn} aria-label="Поиск">
            <Image src="/lupe.png" alt="" width={20} height={20} />
          </button>
          <a href="#" className={styles.lang}>En</a>
        </div>

        {/* Иконки (мобайл) */}
        <div className={styles.header__mobileIcons}>
          <a href="tel:+78002569897" className={styles.iconBtn} aria-label="Позвонить">
            <Image src="/phone.png" alt="" width={22} height={22} />
          </a>
          <button className={styles.iconBtn} aria-label="Поиск">
            <Image src="/lupe.png" alt="" width={22} height={22} />
          </button>
          <button
            className={styles.iconBtn}
            aria-label="Меню"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(v => !v)}
          >
            <Image src="/burger.png" alt="" width={24} height={18} />
          </button>
        </div>
      </div>

      {/* Мобильное off-canvas меню */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
        <nav>
          <a href="#" onClick={() => setMobileOpen(false)}>Мы</a>
          <a href="#" onClick={() => setMobileOpen(false)}>Услуги</a>
          <a href="#" onClick={() => setMobileOpen(false)}>Работы</a>
          <a href="#" onClick={() => setMobileOpen(false)}>Продукты</a>
          <a href="tel:+78002569897" className={styles.mobilePhone} onClick={() => setMobileOpen(false)}>
            8 800 256-98-97
          </a>
        </nav>
      </div>

      {mobileOpen && <div className={styles.backdrop} onClick={() => setMobileOpen(false)} />}
    </header>
  );
}