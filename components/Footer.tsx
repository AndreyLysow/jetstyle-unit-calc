'use client';
import Image from 'next/image';
import styles from '../styles/Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footer__top}`}>
        <div className={styles.footer__col}>
          <Image
            src="/logo_white.png"
            alt="JetStyle"
            width={120}
            height={40}
            className={styles.footer__logo}
            priority
          />
          <p className={styles.footer__text}>
            JetStyle — digital-продакшен. 20+ лет делаем продукты и сервисы,
            решая бизнес-задачи клиентов.
          </p>
        </div>

        <nav className={styles.footer__col}>
          <h4 className={styles.footer__title}>Навигация</h4>
          <ul className={styles.footer__list}>
            <li><a href="#">Мы</a></li>
            <li><a href="#">Услуги</a></li>
            <li><a href="#">Работы</a></li>
            <li><a href="#">Продукты</a></li>
          </ul>
        </nav>

        <div className={styles.footer__col}>
          <h4 className={styles.footer__title}>Контакты</h4>
          <ul className={styles.footer__list}>
            <li><a href="tel:+78002569897">8 800 256-98-97</a></li>
            <li><a href="mailto:hello@jetstyle.ru">hello@jetstyle.ru</a></li>
            <li>Екатеринбург, ул. Малышева, 51</li>
          </ul>
          <a className={`btn btn--primary ${styles.footer__btn}`} href="#callback">
            Записаться на консультацию
          </a>
        </div>
      </div>

      <div className={styles.footer__bottom}>
        <div className={`container ${styles.footer__bottom__in}`}>
          <span>© {new Date().getFullYear()} JetStyle</span>
          <a href="#" className={styles.footer__policy}>Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  );
}