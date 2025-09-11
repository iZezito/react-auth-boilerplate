import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {CircleUser, LogOut} from "lucide-react";
import {Link} from "react-router-dom";
import {LineMdCogLoop} from "./icons/index.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useAuth} from "@/contexts/AuthContext.tsx";

type Props = {
    isAuthenticated?: boolean;
};

const LoginBadge = ({isAuthenticated}: Props) => {
    const { logout } = useAuth();
    return (
        <>
            {isAuthenticated && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar>
                            <AvatarImage src={""}/>
                            <AvatarFallback className="bg-primary">
                                <CircleUser className="h-5 w-5"/>
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Link to="/profile" className="flex flex-1 justify-start items-center">
                                <LineMdCogLoop className="mr-2"/>
                                Perfil
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className="p-0 m-0">
                            <Button variant={"ghost"} onClick={() => logout()} className="flex flex-1 justify-around">
                                <LogOut/> Sair
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
            {!isAuthenticated && (
                <Link to={'/login'}>
                    <Button variant={"default"}>Entrar</Button>
                </Link>
            )}
        </>
    );
};

export default LoginBadge;
