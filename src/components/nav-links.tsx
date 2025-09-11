import { Link, useLocation } from "react-router";

type NavLinksProps = {
    classe: string;
};

const NavLinks = ({ classe }: NavLinksProps) => {
    const location = useLocation();

    const linkClass = (path: string) =>
        `transition-colors hover:text-foreground min-w-fit ${
            location.pathname === path ? "text-foreground font-bold" : "text-muted-foreground"
        }`;

    return (
        <div className={classe}>
            <Link to="/home" className={linkClass("/home")}>
                Início
            </Link>
        </div>
    );
};

export default NavLinks;
