'use client';

import s from '@/styles/ueinfo.module.scss';

type Props = { onConsult: () => void };

export default function UEInfo({ onConsult }: Props) {
  return (
    <section className={s.wrap} aria-labelledby="ueh">
      {/* Блок «Что такое юнит-экономика?» */}
      <div className={s.card}>
        <h2 id="ueh" className={s.h}>Что такое юнит-экономика?</h2>

        <p className={s.p}>
          Если кратко — это методология, которая позволяет оценить состоимость экономики на конкретных цифрах.
          То есть, рассчитывая юнит-экономику, мы оцениваем, масштабируем ли мы прибыль или убыток: сколько
          тратим на привлечение одного клиента в выбранном рекламном канале и сколько с него зарабатываем.
          Затем смотрим, как это работает в масштабе.
        </p>

        <p className={s.p}><strong>Подробнее про юнит-экономику читайте:</strong></p>
        <ul className={s.links}>
          <li><a href="#" rel="nofollow">Точки роста и управление продуктом (VC.ru)</a></li>
          <li><a href="#" rel="nofollow">Как посчитать и где уместно использовать (Gnor Productstar)</a></li>
          <li><a href="#" rel="nofollow">Склады «Директ» и Facebook (Fox/Callibri)</a></li>
          <li><a href="#" rel="nofollow">Product Discovery для проверки прогнозов (Denis Beskov)</a></li>
          <li><a href="#" rel="nofollow">Юнит-экономика: полный разбор (Skillbox)</a></li>
        </ul>

        <p className={s.subhead}>Хочу применять подход в своём бизнесе — что потребуется?</p>
        <ul className={s.list}>
          <li>Веб-аналитика: CPC по каналам, CR1/CR2, APC и т.п.</li>
          <li>CRM для «доходной» части воронки (AvP, CoGS, APC).</li>
          <li>Связка CRM и веб-аналитики для отчётов по каналам.</li>
        </ul>
      </div>

      {/* Блок «Остались вопросы?» */}
      <div className={s.card}>
        <h3 className={s.h2}>Остались вопросы?</h3>

        <div className={s.row}>
          <div className={s.colText}>
            <p className={s.p}>
              На консультации можно задать вопросы о юнит-экономике и веб-аналитике, упорядочить гипотезы
              и наметить ближайшие шаги.
            </p>

            <button type="button" className={s.btn} onClick={onConsult}>
              Записаться
            </button>
          </div>

          <div className={s.colPhoto}>
            {/* Положи заглушку в /public/img/ue-placeholder.png */}
            <img
              src="/img/ue-placeholder.png"
              alt="Фото спикера"
              className={s.photo}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}