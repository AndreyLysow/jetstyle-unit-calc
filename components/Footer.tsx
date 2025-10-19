'use client';

import Image from 'next/image';
import styles from '../styles/Footer.module.scss';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* ===== Верхняя полоса: контакты + офисы ===== */}
      <div className={`container ${styles.top}`}>
        {/* Контакты */}
        <div className={styles.contacts}>
          <div className={styles.phone}>8 800 365-78-79</div>
          <a href="mailto:info+site@jetstyle.ru" className={styles.mail}>
            info+site@jetstyle.ru
          </a>

          <div className={styles.socials}>
            <a href="#" aria-label="VC.ru" className={styles.socialBtn}>
              <Image src="/img/socials/vc.png" alt="VC" width={24} height={24} />
            </a>
            <a href="#" aria-label="Telegram" className={styles.socialBtn}>
              <Image src="/img/socials/tg.png" alt="Telegram" width={24} height={24} />
            </a>
            <a href="#" aria-label="VK" className={styles.socialBtn}>
              <Image src="/img/socials/vk.png" alt="VK" width={24} height={24} />
            </a>
            <a href="#" aria-label="Dzen" className={styles.socialBtn}>
              <Image src="/img/socials/dzen1.png" alt="Dzen" width={24} height={24} />
            </a>
            <a href="#" aria-label="Dzen" className={styles.socialBtn}>
              <Image src="/img/socials/dzen.png" alt="Dzen" width={24} height={24} />
            </a>
          </div>
        </div>

        {/* Офисы */}
        <div className={styles.offices}>
          <article className={styles.office}>
            <div className={styles.officeIcon}>
              <Image src="/img/ekb.png" alt="Екатеринбург" width={56} height={56} priority />
            </div>
            <h4 className={styles.officeCity}>Екатеринбург</h4>
            <div className={styles.officeAddr}>
              Малышева 51<br />(Высоцкий, 29-й этаж)
            </div>
          </article>

          <article className={styles.office}>
            <div className={styles.officeIcon}>
              <Image src="/img/arrakis.png" alt="Arrakis" width={72} height={56} />
            </div>
            <h4 className={styles.officeCity}>Arrakis</h4>
            <div className={styles.officeAddr}>
              29th floor, Grand Palace,<br />Arrakeen
            </div>
          </article>

          <article className={styles.office}>
            <div className={styles.officeIcon}>
              <Image src="/img/tatooine.png" alt="Tatooine" width={72} height={56} />
            </div>
            <h4 className={styles.officeCity}>Tatooine</h4>
            <div className={styles.officeAddr}>
              14 Kerner Plaza,<br />Mos Eisley
            </div>
          </article>
        </div>
      </div>

      {/* ===== Разделитель ===== */}
      <div className={styles.hr} />

      {/* ===== Нижний блок: промо + 3 колонки ссылок ===== */}
      <div className={`container ${styles.linksRow}`}>
        {/* —— ПРОМО —— */}
        <aside className={styles.promos}>
          {/* BIM VR */}
          <article className={`${styles.promoCard} ${styles.bimVr}`}>
            <div className={styles.promoContent}>
              <div className={styles.textBlock}>
                <h4 className={styles.promoTitle}>BIM VR</h4>
                <p className={styles.promoSub}>
                  Среда визуализации и совместной <br />работы с BIM
                </p>
              </div>
              <button className={styles.arrowBtn} aria-label="Открыть BIM VR">
                <Image src="/img/ui/arrow-right.svg" alt="" width={18} height={18} />
              </button>
            </div>

            <div className={styles.imageBlock}>
              <Image
                src="/bim_vr.png"
                alt="BIM VR"
                fill
                className={styles.cardImage}
                sizes="(max-width: 600px) 100vw, 324px"
                priority
              />
            </div>
          </article>

          {/* JetStyle Promo */}
          <article className={styles.promoCard}>
            <div className={styles.promoContent}>
              <div className={styles.textBlock}>
                <div className={styles.logoTitle}>
                  <Image src="/jspromo.svg" alt="JetStyle Promo" width={160} height={28} />
                </div>
                <p className={styles.promoSub}>
                  Комплексный Digital-маркетинг <br />для B2B и B2C
                </p>
              </div>
              <button className={styles.arrowBtn} aria-label="Открыть JetStyle Promo">
                <Image src="/img/ui/arrow-right.svg" alt="" width={18} height={18} />
              </button>
            </div>
          </article>
        </aside>

        {/* —— 3 колонки ссылок —— */}
        <nav className={styles.linkCol}>
          <ul>
            <li><a href="#">Мы</a></li>
            <li><a href="#">Услуги</a></li>
            <li><a href="#">Работы</a></li>
            <li><a href="#">Презентация</a></li>
          </ul>
        </nav>

        <nav className={styles.linkCol}>
          <ul>
            <li><a href="#">Приходи на стажировку!</a></li>
            <li><a href="#">Опыты Алексея Кулакова</a></li>
            <li><a href="#">Новогодние поздравления</a></li>
            <li><a href="#">Партнёрская программа</a></li>
            <li><a href="#">Калькулятор unit-экономики</a></li>
            <li><a href="#">JetStyle дарит плакаты</a></li>
          </ul>
        </nav>

        {/* —— Третья колонка: в один столбец —— */}
        <nav className={styles.linkCol}>
          <ul className={styles.oneColList}>
            <li><a href="#">Дизайн</a></li>
            <li><a href="#">Разработка</a></li>
            <li><a href="#">Маркетинг</a></li>
            <li><a href="#">Чат-боты</a></li>
            <li><a href="#">AR/VR</a></li>
            <li><a href="#">Motion</a></li>
          </ul>
        </nav>
      </div>

      {/* ===== Низ ===== */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomIn}>
            <a href="#" className={styles.policy}>Политика конфиденциальности</a>
            <span className={styles.copy}>© 2004–{year} JetStyle</span>
          </div>
        </div>
      </div>
    </footer>
  );
}