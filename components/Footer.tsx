'use client';

import Image from 'next/image';
import styles from '@/styles/Footer.module.scss';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* ===== верхняя полоса с контактами и офисами ===== */}
      <div className={`container ${styles.top}`}>
        {/* Контакты слева */}
        <div className={styles.contacts}>
          <div className={styles.phone}>8 800 365-78-79</div>
          <a href="mailto:info+site@jetstyle.ru" className={styles.mail}>
            info+site@jetstyle.ru
          </a>


	<div className={styles.socials}>
		<a
			href="#"
			aria-label="VC.ru"
			className={styles.socialBtn}
			target="_blank"
			rel="noopener noreferrer"
		>
			<Image src="/img/socials/vc.png" alt="VC.ru" width={48} height={48} className={styles.socialIcon} />
		</a>

		<a
			href="#"
			aria-label="Telegram"
			className={styles.socialBtn}
			target="_blank"
			rel="noopener noreferrer"
		>
			<Image src="/img/socials/tg.png" alt="Telegram" width={48} height={48} className={styles.socialIcon} />
		</a>

		<a
			href="#"
			aria-label="VK"
			className={styles.socialBtn}
			target="_blank"
			rel="noopener noreferrer"
		>
			<Image src="/img/socials/vk.png" alt="VK" width={48} height={48} className={styles.socialIcon} />
		</a>

		<a
			href="#"
			aria-label="Dzen"
			className={styles.socialBtn}
			target="_blank"
			rel="noopener noreferrer"
		>
			<Image src="/img/socials/dzen1.png" alt="Dzen" width={48} height={48} className={styles.socialIcon} />
		</a>
		<a
			href="#"
			aria-label="Dzen"
			className={styles.socialBtn}
			target="_blank"
			rel="noopener noreferrer"
		>
			<Image src="/img/socials/dzen.png" alt="Dzen" width={48} height={48} className={styles.socialIcon} />
		</a>

		</div>

        </div>

        {/* Офисы (3 колонки как в прототипе) */}
        <div className={styles.offices}>
          {/* Екатеринбург */}
          <article className={styles.office}>
            <div className={styles.officeIcon}>
              <Image
                src="/img/ekb.png"               // ← убрал двойной слэш
                alt="Екатеринбург"
                width={56}
                height={56}
                className={styles.officeImg}
                priority
              />
            </div>
            <h4 className={styles.officeCity}>Екатеринбург</h4>
            <div className={styles.officeAddr}>
              Малышева, 51<br />
              (Высоцкий, 29-й этаж)
            </div>
          </article>

          {/* Arrakis */}
          <article className={styles.office}>
            <div className={styles.officeIcon}>
              <Image
                src="/img/arrakis.png"
                alt="Arrakis"
                width={72}
                height={56}
                className={styles.officeImg}
              />
            </div>
            <h4 className={styles.officeCity}>Arrakis</h4>
            <div className={styles.officeAddr}>
              29th floor, Grand Palace,<br />
              Arrakeen
            </div>
          </article>

          {/* Tatooine */}
          <article className={styles.office}>
            <div className={styles.officeIcon}>
              <Image
                src="/img/tatooine.png"
                alt="Tatooine"
                width={72}
                height={56}
                className={styles.officeImg}
              />
            </div>
            <h4 className={styles.officeCity}>Tatooine</h4>
            <div className={styles.officeAddr}>
              14, Kerner Plaza,<br />
              Mos Eisley
            </div>
          </article>
        </div>
      </div>  {/* ← ЭТОТ ЗАКРЫВАЮЩИЙ DIV НУЖЕН! */}

      {/* разделитель */}
      <div className={styles.hr} />

      {/* ===== три колонки ссылок — как в макете ===== */}
      <div className={`container ${styles.linksRow}`}>
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

        <nav className={styles.linkCol}>
          <ul className={styles.twoColList}>
            <li><a href="#">Дизайн</a></li>
            <li><a href="#">Разработка</a></li>
            <li><a href="#">Маркетинг</a></li>
            <li><a href="#">Чат-боты</a></li>
            <li><a href="#">AR/VR</a></li>
            <li><a href="#">Motion</a></li>
          </ul>
        </nav>
      </div>

      {/* ===== низ ===== */}
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