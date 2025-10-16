import { ABBR } from './abbr';

export default function AbbrTooltip({ code }: { code: keyof typeof ABBR }) {
  return (
    <span className="tooltip">
      {code}
      <span className="tooltip__card">{ABBR[code]}</span>
    </span>
  );
}