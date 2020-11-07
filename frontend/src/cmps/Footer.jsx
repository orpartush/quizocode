import React from 'react';
import { SiLinkedin, SiGithub } from 'react-icons/si';

function Footer() {
    return (
        <div className="footer flex flex-column align-center justify-center">
            <p className="logo">Quizocode</p>
            <section className="rights flex align-center">
                <span>Created by Or Partush</span>
                <a
                    className="portfolio"
                    href="https://orpartush-portfolio.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Portfolio
                </a>
                <section className="social-links">
                    <a href="https://www.linkedin.com/in/or-partush/" target="_blank" rel="noopener noreferrer">
                        <SiLinkedin className="sl-icon" />
                    </a>
                    <a href="https://github.com/orpartush?tab=repositories" target="_blank" rel="noopener noreferrer">
                        <SiGithub className="sl-icon" />
                    </a>
                </section>
            </section>
        </div>
    );
}

export default Footer;
