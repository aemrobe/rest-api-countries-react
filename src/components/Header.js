import { DarkModeThemeSwitcher } from "./DarkModeThemeSwitcher";
import Logo from "./Logo";

export default function Header({ pageMode, setPageMode }) {
  return (
    <div className="header-container">
      <header>
        <Logo />
        <DarkModeThemeSwitcher pageMode={pageMode} setPageMode={setPageMode} />
      </header>
    </div>
  );
}
