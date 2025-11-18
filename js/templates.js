
const Templates = {
    home: () => `
        <div class="container">
            <div class="grid grid-center">
                <div class="col-12 lg:col-8">
                    <h2>Seja voluntário!</h2>
                    <p>Você acredita que a dança pode salvar vidas? Faça parte desse movimento com a gente!</p>
                    <p><a class="button-voluntario" href="#" data-route="/cadastro">Quero ser voluntário</a></p>
                </div>
            </div>

            <div class="grid">
                <div class="col-12 lg:col-4">
                    <section>
                        <div class="section-image">
                            <img src="imagem/danca-quem-somos.svg" alt="Dançarino representando nossa identidade" class="dance-icon">
                        </div>
                        <h2>Quem somos</h2>
                        <p>A <strong>ONG PERIFA NO TOQUE</strong> nasceu em 2025 em Itaquaquecetuba, no Extremo Leste de São Paulo, dedicada a promover 
                    as danças urbanas como forma de expressão cultural e inclusão social.</p>
                    </section>
                </div>

                <div class="col-12 lg:col-4">
                    <section>
                        <div class="section-image">
                            <img src="imagem/danca-missao.svg" alt="Grupo de dançarinos unidos em nossa missão" class="dance-icon">
                        </div>
                        <h2>Nossa Missão</h2>
                        <p>Promover a cultura das danças urbanas como ferramenta de expressão, inclusão social e 
                    desenvolvimento pessoal para jovens da Zona Leste, oferecendo oficinas, eventos e 
                    espaços de convivência que incentivem criatividade, disciplina e trabalho em equipe.</p>
                    </section>
                </div>

                <div class="col-12 lg:col-4">
                    <section>
                        <div class="section-image">
                            <img src="imagem/danca-contato.svg" alt="Dançarino conectando com a comunidade" class="dance-icon">
                        </div>
                        <h2>Contato</h2>
                        <address>
                            <p>Endereço: R. da Resistência, 123. Bairro Submundo, Itaquaquecetuba - SP</p>
                            <p>Telefone: (11) 9 8765-4321</p>
                            <p>Email: contato@ongpnt.org</p>
                        </address>
                    </section>
                </div>
            </div>
        </div>

        <section class="video-section">
            <div class="video-container">
                <iframe 
                    src="https://www.youtube.com/embed/4EpIzcqRWAg?autoplay=1&mute=1&loop=1&playlist=4EpIzcqRWAg&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3"
                    title="Dança Urbana - Perifa no Toque"
                    frameborder="0"></iframe>
            </div>
        </section>
    `,

    projeto: () => `
        <div class="container">
            <div class="grid grid-center">
                <div class="col-12">
                    <h1>Nossos Projetos</h1>
                </div>
            </div>
            
            <div class="grid content-container">
                <div class="col-12 md:col-6">
                    <div class="hero-image">
                        <img src="imagem/danca.jpg" alt="Dançarinos da Perifa no Toque em ação" class="project-hero-img">
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <div class="hero-text">
                        <p> Na Perifa no Toque, a dança é mais do que movimento — é voz, resistência e transformação.
                    Nossos projetos nascem da quebrada, com o pé no chão da Zona Leste e o olhar voltado para o futuro.
                    Acreditamos que a arte pode abrir caminhos, fortalecer identidades e criar oportunidades reais para nossa juventude.</p>
                        <p> Conheça um pouco do que a gente faz!</p>
                    </div>
                </div>
            </div>

            <div class="grid">
                <div class="col-12 lg:col-4">
                    <section>
                        <h2>Oficina Mimitos</h2>
                        <p> Oferecemos <strong>oficinas gratuitas</strong> de danças urbanas — como passinho, hip hop, locking e funk — abertas para crianças e jovens da comunidade.</p>
                        <p> Aqui, cada aluno aprende no seu ritmo, desenvolve confiança e descobre novas formas de se expressar.
                            Os encontros acontecem semanalmente em espaços comunitários e escolas parceiras da região.</p>
                    </section>
                </div>

                <div class="col-12 lg:col-4">
                    <section>
                        <h2>Voz é poder</h2>
                        <p> Um projeto que une dança e cidadania. Com objetivo de formar cidadãos conscinetes e aristas com propósito.</p>
                        <p> Além das aulas práticas, realizamos rodas de conversa sobre autoestima, racismo, gênero e protagonismo juvenil.
                            Queremos que cada participante entenda que dançar é também uma forma de ocupar espaços e contar sua própria história.</p>
                    </section>
                </div>

                <div class="col-12 lg:col-4">
                    <section>
                        <h2>Batalha no Toque</h2>
                        <p> Nosso evento semestral que reúne dançarinos, DJs e MCs da quebrada em batalhas de dança, showcases e apresentações abertas ao público.
                        Mais do que competição, é encontro, cultura e resistência, criando pontes entre a arte e a comunidade</p>
                    </section>
                </div>
            </div>

            <div class="grid grid-center">
                <div class="col-12 lg:col-6">
                    <section>
                        <h2>Contato</h2>
                        <address>
                            <p>Endereço: R. da Resistência, 123. Bairro Submundo, Itaquaquecetuba - SP</p>
                            <p>Telefone: (11) 9 8765-4321</p>
                            <p>Email: contato@ongpnt.org</p>
                        </address>
                    </section>
                </div>
            </div>
        </div>
    `,

    cadastro: () => `
        <div class="container">
            <div class="grid">
                <div class="col-12">
                    <h2>Cadastro de Voluntários</h2>
                    <form id="cadastro-form">
                        <fieldset>
                            <legend>Informações pessoais</legend>
                            <div class="grid grid-sm">
                                <div class="col-12 md:col-6">
                                    <label for="inome">Nome *:</label>
                                    <input type="text" name="nome" id="inome" required/>
                                </div>
                                <div class="col-12 md:col-6">
                                    <label for="isobrenome">Sobrenome *:</label>
                                    <input type="text" name="sobrenome" id="isobrenome" required/>
                                </div>
                                <div class="col-12 md:col-6">
                                    <label for="inascim">Data de Nascimento *</label>
                                    <input type="date" name="nascim" id="inascim" required/>
                                </div>
                                <div class="col-12 md:col-6">
                                    <label for="icpf">CPF *</label>
                                    <input type="text" name="cpf" id="icpf" required/>
                                </div>
                                <div class="col-12 md:col-6">
                                    <label for="iemail">E-mail *</label>
                                    <input type="email" name="email" id="iemail" required/>
                                </div>
                                <div class="col-12 md:col-6">
                                    <label for="itel">Celular *</label>
                                    <input type="tel" name="tel" id="itel" required/>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Disponibilidade</legend>
                            <div class="grid grid-sm">
                                <div class="col-12 md:col-6">
                                    <label for="iarea">Como gostaria de ajudar?</label>
                                    <select name="area" id="iarea" required>
                                        <option value="">Selecione uma opção</option>
                                        <option value="Planejamento de Eventos">Planejamento de Eventos</option>
                                        <option value="Oficinas de Dança">Oficinas de Dança</option>
                                        <option value="Comunicação e Redes Sociais">Comunicação e Redes Sociais</option>
                                        <option value="Captação de Recursos">Captação de Recursos</option>
                                    </select>
                                </div>
                                <div class="col-12 md:col-6">
                                    <label for="itemp">Disponibilidade de tempo</label>
                                    <select name="temp" id="itemp" required>
                                        <option value="">Selecione uma opção</option>
                                        <option value="Manhã">Manhã</option>
                                        <option value="Tarde">Tarde</option>
                                        <option value="Noite">Noite</option>
                                        <option value="Fim de Semana">Fim de Semana</option>
                                    </select>
                                </div>
                            </div>
                        </fieldset>            
                        
                        <fieldset>
                            <legend>Fale sobre você</legend>
                            <div class="grid">
                                <div class="col-12">
                                    <label for="iint">Por que gostaria de ser voluntário?</label>
                                    <input type="text" name="int" id="iint" minlenghts="20"/>
                                </div>
                            </div>
                        </fieldset>            

                        <fieldset>
                            <div class="grid justify-center">
                                <div class="col-12 md:col-6 lg:col-4">
                                    <input type="submit" id="submitBtn" value="Enviar" disabled/>
                                </div>
                                <div class="col-12 md:col-6 lg:col-4">
                                    <input type="reset" value="Limpar"/>
                                </div>
                            </div>
                        </fieldset>
                    </form> 
                </div>
            </div>
        </div>
    `
};
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Templates;
}