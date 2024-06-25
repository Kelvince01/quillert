import Link from "next/link";
import Image from "next/image";
import {Container, Section} from "@/components/craft";
import Balancer from "react-wrap-balancer";
import {DESCRIPTION} from "@/config";
import {contentMenu, mainMenu} from "@/config/menu.config";
import { ThemeToggle } from "../theme/theme-toggle";
import Logo from "../../../public/app-logo.png";
import Nav from "@/components/layout/nav";

const Footer = () => {
    return (
        <footer>
            <Section>
                <Container className="grid md:grid-cols-[1.5fr_0.5fr_0.5fr] gap-12">
                    <div className="flex flex-col gap-6 not-prose">
                        <Link href="/">
                            <h3 className="sr-only">brijr/components</h3>
                            <Image
                                src={Logo}
                                alt="Logo"
                                width={120}
                                height={27.27}
                                className="dark:invert hover:opacity-75 transition-all"
                            ></Image>
                        </Link>
                        <p>
                            <Balancer>{DESCRIPTION}</Balancer>
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                        <h5 className="font-medium text-base">Website</h5>
                        {Object.entries(mainMenu).map(([key, href]) => (
                            <Link
                                className="hover:underline underline-offset-4"
                                key={href}
                                href={href}
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                        <h5 className="font-medium text-base">Blog</h5>
                        {Object.entries(contentMenu).map(([key, href]) => (
                            <Link
                                className="hover:underline underline-offset-4"
                                key={href}
                                href={href}
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Link>
                        ))}
                    </div>
                </Container>
                <Container className="border-t not-prose flex flex-col md:flex-row md:gap-2 gap-6 justify-between md:items-center">
                    <ThemeToggle />
                    <p className="text-muted-foreground">
                        © <a href="https://9d8.dev">9d8</a>. All rights reserved.
                        2024-present.
                    </p>
                </Container>
            </Section>
        </footer>
    );
};

export default Footer;