import React from 'react'

import { LazyLoadImage } from 'react-lazy-load-image-component'

import { BsFacebook } from "react-icons/bs"
import { GrInstagram } from "react-icons/gr"
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi"
import { AiOutlineYoutube } from 'react-icons/ai'
import {ImPinterest2} from "react-icons/im"

const Footer = () => {
    return (
        <footer aria-label="Site Footer" className="bg-bgBlack">
            <div className="mx-auto max-w-screen-2xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div>
                        <div className="flex justify-center text-white sm:justify-start">
                            <img effect='blur' width="289" height="153" alt="Logo fondo trasparente" src="https://calyaan.b-cdn.net/wp-content/uploads/2021/11/RecursoRecurso-3-.png" />
                        </div>

                        <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
                            <li>
                                <a
                                    href="https://www.facebook.com/Calyaan-105376747798392"
                                    target="_blank"
                                    className="text-white transition hover:text-white/75"
                                >
                                    <span className="sr-only">Facebook</span>
                                    <BsFacebook className="h-6 w-6" />

                                </a>
                            </li>

                            <li>
                                <a
                                    href="https://www.instagram.com/calyaancol/"
                                    target="_blank"
                                    className="text-white transition hover:text-white/75"
                                >
                                    <span className="sr-only">Instagram</span>
                                    <GrInstagram className="h-6 w-6" />

                                </a>
                            </li>

                            <li>
                                <a
                                    href="https://www.youtube.com/channel/UCJNVxAjRm23sU7Q8ylvYxWA"
                                    target="_blank"
                                    className="text-white transition hover:text-white/75"
                                >
                                    <span className="sr-only">Youtube</span>
                                    <AiOutlineYoutube className="h-6 w-6" />

                                </a>
                            </li>

                            <li>
                                <a
                                    href="https://co.pinterest.com/calyaancol/_created/"
                                    target="_blank"
                                    className="text-white transition hover:text-white/75"
                                >
                                    <span className="sr-only">Pinterest</span>
                                    <ImPinterest2 className="h-6 w-6" />

                                </a>
                            </li>
                          

                        </ul>
                    </div>

                    <div
                        className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2"
                    >
                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium text-white text-bold ">Calyaan</p>

                            <nav aria-label="Footer About Nav" className="mt-8">
                                <ul className="space-y-4 text-sm">
                                    <li>
                                        <a
                                            className="text-white transition hover:text-white/75"
                                            href="https://calyaan.com/quienes-somos/"
                                        >
                                            Nosotros
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            className="text-white transition hover:text-white/75"
                                            href="https://calyaan.com/"
                                        >
                                            Contacto
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            className="text-white transition hover:text-white/75"
                                            href="https://calyaan.com/blog/"
                                        >
                                            Blog
                                        </a>
                                    </li>

                                </ul>
                            </nav>
                        </div>

                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium text-white text-bold ">Enlaces</p>

                            <nav aria-label="Footer Services Nav" className="mt-8">
                                <ul className="space-y-4 text-sm">
                                    <li>
                                        <a
                                            className="text-white transition hover:text-white/75"
                                            href="https://calyaan.com/"
                                        >
                                            Tienda
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            className="text-white transition hover:text-white/75"
                                            href="https://calyaan.com/masajes-empresariales/"
                                        >
                                            Servicio corporativo
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            className="text-white transition hover:text-white/75"
                                            href="https://calyaan.com/colaboradores/"
                                        >
                                            Trabaja con nosotros
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            className="text-white transition hover:text-white/75"
                                            href="https://calyaan.com/privacidad/"
                                        >
                                            Privacidad
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            className="text-white transition hover:text-white/75"
                                            href="https://calyaan.com/habeas-data/"
                                        >
                                            Habeas data
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium text-white text-bold ">Contáctanos</p>

                            <ul className="mt-8 space-y-4 text-sm">
                            
                                <li>
                                    <a
                                        className="flex items-center justify-center gap-1.5 sm:justify-start"
                                        href="mailto:Calyaan.com@gmail.com"
                                    >
                                        <HiOutlineMail className="h-5 w-5 shrink-0 text-white" />

                                        <span className="text-white">calyaan.com@gmail.com</span>
                                    </a>
                                </li>

                                <li>
                                    <a
                                        className="flex items-center justify-center gap-1.5 sm:justify-start"
                                        href="https://api.whatsapp.com/send/?phone=573147428757&text&app_absent=0"
                                        target="_blank"
                                    >
                                        <HiOutlinePhone className="h-5 w-5 shrink-0 text-white" />

                                        <span className="text-white">(+57) 3147428757</span>
                                    </a>
                                </li>


                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-100 pt-6">
                    <div className="text-center sm:flex sm:justify-between sm:text-left">

                        <p className="mt-4 text-sm text-white sm:order-first sm:mt-0">
                            Copyright &copy; 2023 Calyaan
                        </p>
                    </div>
                </div>
            </div>
        </footer>


    )
}

export default Footer