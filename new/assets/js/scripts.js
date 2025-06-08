$(document).ready(function () {
    // ===== INÍCIO - GERENCIAMENTO DE UTMs CORRIGIDO =====

    // Função centralizada para capturar e salvar UTMs
    function captureAndSaveUTMs() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmParams = {};

        // Lista de parâmetros UTM para capturar
        const paramsToCapture = [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
            'src', 'gclid', 'wbraid', 'gbraid', 'keyword', 'device', 'network'
        ];

        paramsToCapture.forEach(param => {
            if (urlParams.has(param)) {
                utmParams[param] = urlParams.get(param);
            }
        });

        // Salvar no localStorage se houver parâmetros
        if (Object.keys(utmParams).length > 0) {
            localStorage.setItem('utmParams', JSON.stringify(utmParams));
            console.log('✅ UTMs capturados e salvos:', utmParams);
        } else {
            console.log('ℹ️ Nenhum UTM encontrado na URL atual');
        }
    }

    // Função CORRIGIDA para obter UTMs (prioriza URL atual, usa localStorage como fallback)
    function getUTMParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmParams = {};
        const paramsToCapture = [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
            'src', 'gclid', 'wbraid', 'gbraid', 'keyword', 'device', 'network'
        ];

        // Primeiro, tenta capturar da URL atual
        paramsToCapture.forEach(param => {
            if (urlParams.has(param)) {
                utmParams[param] = urlParams.get(param);
            }
        });

        // Se não encontrou UTMs na URL atual, usa o localStorage como fallback
        if (Object.keys(utmParams).length === 0) {
            const storedUtms = localStorage.getItem('utmParams');
            if (storedUtms) {
                try {
                    const parsedUtms = JSON.parse(storedUtms);
                    Object.assign(utmParams, parsedUtms);
                    console.log('✅ UTMs recuperados do localStorage:', utmParams);
                } catch (e) {
                    console.error('❌ Erro ao parsear UTMs do localStorage:', e);
                }
            } else {
                console.log('⚠️ Nenhum UTM encontrado no localStorage');
            }
        } else {
            console.log('✅ UTMs encontrados na URL atual:', utmParams);
        }

        return utmParams;
    }

    // Função UNIFICADA para construir URL com UTMs
    function buildUrlWithUTMs(baseUrl) {
        const utmParams = getUTMParams();

        if (Object.keys(utmParams).length === 0) {
            console.log('⚠️ Nenhum UTM encontrado para adicionar à URL:', baseUrl);
            return baseUrl;
        }

        const utmString = Object.keys(utmParams)
            .map(key => `${key}=${encodeURIComponent(utmParams[key])}`)
            .join('&');

        const separator = baseUrl.includes('?') ? '&' : '?';
        const finalUrl = `${baseUrl}${separator}${utmString}`;
        
        console.log('🔗 URL construída:', baseUrl, '→', finalUrl);
        return finalUrl;
    }

    // Capturar UTMs na inicialização
    captureAndSaveUTMs();

    // ===== TRATAMENTO ESPECÍFICO PARA BOTÕES DA SEÇÃO NotImg =====
    
    // Função para aplicar UTMs nos botões da seção NotImg
    function applyUTMsToNotImgButtons() {
        console.log('🔧 Aplicando UTMs nos botões da seção NotImg');
        
        $('.NotImg a[href]').each(function() {
            const $link = $(this);
            const originalHref = $link.attr('href');
            
            if (originalHref && !$link.data('utm-processed')) {
                // Múltiplas opções de URL para cada botão
                let possibleUrls = [];
                
                if (originalHref.includes('marido')) {
                    possibleUrls = [
                        './marido/',
                        './marido/index.html',
                        'marido/',
                        'marido/index.html'
                    ];
                } else if (originalHref.includes('esposa')) {
                    possibleUrls = [
                        './esposa/',
                        './esposa/index.html',
                        'esposa/',
                        'esposa/index.html'
                    ];
                } else {
                    // Para outros links, usa o href original
                    possibleUrls = [originalHref];
                }
                
                const newHref = buildUrlWithUTMs(possibleUrls[0]);
                $link.attr('href', newHref);
                $link.data('utm-processed', true);
                
                console.log(`✅ UTMs aplicados no botão: ${originalHref} → ${newHref}`);
            }
        });
    }

    // ===== FIM - GERENCIAMENTO DE UTMs CORRIGIDO =====

    // Variáveis globais
    let randomChangeInterval;
    const userLocation = 'Brasil';
    const initialBackRedirectUrl = 'https://descubra-tudospy.online/back-r-passo1/';

    // Função para configurar o URL de redirecionamento dinâmico - CORRIGIDA
    let urlBackRedirect = initialBackRedirectUrl;
    const setBackRedirect = (newUrl) => {
        urlBackRedirect = buildUrlWithUTMs(newUrl.trim());

        // Reinicia a lógica de manipulação de histórico após a atualização
        history.replaceState({}, "", location.href);
        history.pushState({}, "", location.href);
    };

    // Configura o redirecionamento inicial
    setBackRedirect(initialBackRedirectUrl);

    // Lógica de back redirect
    window.onpopstate = function () {
        setTimeout(function () {
            location.href = urlBackRedirect;
        }, 1);
    };

    const texts = [
        'Conectando ao servidor do WhatsApp...',
        'Simulando IP na região de ' + userLocation + '...',
        'Ignorando o firewall...',
        'Injetando consultas SQL...',
        'Buscando informações de {phone}...',
        'Quebrando senha...',
        'Autenticando como {phone}...',
        'Acesso concedido, redirecionando para o servidor solicitado...'
    ];

    // Funções principais
    function updateTextRotation(phone) {
        let index = 0;
        const totalStages = texts.length;
        const textElement = $('.text_ramdom');
        const progressBar = $('.progress-bar');

        const interval = setInterval(() => {
            if (index >= totalStages) {
                clearInterval(interval);

                // Insere o vídeo quando part-3 é exibida
                insertVturbVideo();

                // Exibir part-3 após o progresso
                switchSections('.part-1', '.part-3');

                startRandomValuesInsertion();

                // Fechar o modal após um pequeno delay para a transição
                setTimeout(() => {
                    $('#investigationModal').modal('hide');
                    startAnalysisProgressBar(); // Iniciar o progresso da barra na part-3
                }, 500);

                return;
            }

            // Atualiza o texto e a cor
            const currentText = texts[index].replace('{phone}', phone);
            setTextColor(textElement, currentText);

            // Atualiza a barra de progresso
            updateProgressBar(progressBar, index, totalStages);
            index++;
        }, 3000);
    }

    function setTextColor(element, text) {
        element.text(text).css('color', 'black');
        setTimeout(() => element.css('color', 'green'), 1000);
    }

    function updateProgressBar(progressBar, stage, totalStages) {
        const percentage = ((stage + 1) / totalStages) * 100;
        progressBar.css('width', percentage + '%')
            .attr('aria-valuenow', percentage)
            .text(percentage + '%');
    }

    // Função para iniciar a barra de progresso na part-3
    function startAnalysisProgressBar(totalTimeInSeconds = 368) {
        let width = 0;
        const progressBar = $('.progress_analysct_number .progress-bar');

        // Reinicia a barra de progresso para 0%
        progressBar.css('width', '0%')
            .attr('aria-valuenow', 0)
            .text('0%');

        // Calcula o intervalo com base no tempo total fornecido
        const intervalTime = (totalTimeInSeconds * 1000) / 100;

        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                setTimeout(handleFinalState, 3000);
            } else {
                width++;
                progressBar.css('width', width + '%')
                    .attr('aria-valuenow', width)
                    .text(width + '%');
            }
        }, intervalTime);
    }

    // Função handleFinalState CORRIGIDA com múltiplas opções de redirecionamento
    function handleFinalState() {
        const savedProfilePic = $.cookie('profilePic');
        const aboutText = $.cookie('about') || '';
        const descriptionText = $.cookie('description') || '';

        const verifyButton = $('<button>', {
            class: 'btn btn-primary w-100 mt-3 mb-3',
            text: 'Verificar Resultado'
        });

        $('#verifyButtonContainer').html(verifyButton);

        verifyButton.on('click', function () {
            console.log('🔄 Botão "Verificar Resultado" clicado');
            
            // Debug: verificar UTMs antes do redirecionamento
            const currentUtms = getUTMParams();
            console.log('📊 UTMs disponíveis para redirecionamento:', currentUtms);
            
            if (savedProfilePic) {
                // Múltiplas opções de URL para garantir que funcione
                const possibleUrls = [
                    './concluido/',           // Opção 1: com barra final
                    './concluido/index.html', // Opção 2: com index.html explícito
                    'concluido/',             // Opção 3: sem ponto inicial
                    'concluido/index.html'    // Opção 4: sem ponto inicial + index.html
                ];
                
                // Tenta a primeira opção com UTMs
                const redirectUrl = buildUrlWithUTMs(possibleUrls[0]);
                console.log('🎯 Redirecionando para:', redirectUrl);
                
                // Adiciona um pequeno delay para garantir que os logs sejam visíveis
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 100);
                
            } else {
                console.log('⚠️ Nenhuma foto de perfil encontrada, mostrando seção NotImg');
                $('.NotImg').show();
                $('.part-3').hide();
                $('.withImg').hide();
                
                // Aplica UTMs nos botões da seção NotImg após mostrar a seção
                setTimeout(() => {
                    applyUTMsToNotImgButtons();
                }, 100);
            }
        });

        if (savedProfilePic) {
            $('.profile_picture').attr('src', savedProfilePic).show();
            $('.withImg').hide();
            $('.NotImg').hide();
            updateProfileInfo(aboutText, descriptionText);
        } else {
            $('.profile_picture').hide();
            $('.withImg').hide();
            $('.NotImg').hide();
        }
    }

    function updateProfileInfo(nameProfile, about, description) {
        // Obtém o telefone original direto do input
        const originalPhone = $('#phone').val();

        // Atualiza ou oculta o nome do perfil
        if (nameProfile) {
            $('.name-profile-text').html('<b>Nome no Whatsapp:</b> ' + nameProfile).show();
        } else {
            $('.name-profile-text').hide();
        }

        // Atualiza ou oculta o bio (about)
        if (about) {
            $('.bio-text').html('<b>Bio:</b> ' + about).show();
        } else {
            $('.bio-text').hide();
        }

        // Atualiza ou oculta a descrição (business description)
        if (description) {
            $('.description-text').html('<b>Descrição:</b> ' + description).show();
        } else {
            $('.description-text').hide();
        }

        // Atualiza o telefone original
        if (originalPhone && originalPhone.trim() !== '') {
            $('.phone-number').html('<b>Telefone:</b> ' + originalPhone).show();
        } else {
            $('.phone-number').hide();
        }
    }

    function switchSections(hideSelector, showSelector) {
        $(hideSelector).hide();
        $(showSelector).show();
    }

    function isValidPhone(phone) {
        const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
        return regex.test(phone);
    }

    function formatPhone(phone) {
        return '55' + phone.replace(/\D/g, '');
    }

    function fetchProfileImage(phone) {
        const formattedPhone = formatPhone(phone);
        $.ajax({
            url: 'https://api-spyzap-git-main-tie-marketings-projects.vercel.app/api/fetch_img.js',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ phone: formattedPhone }),
            success: (response) => handleAPISuccess(response, phone),
            error: (xhr, status, error) => console.error("Erro na requisição à API:", status, error)
        });
    }

    function handleAPISuccess(response) {
        try {
            const jsonResponse = typeof response === "string" ? JSON.parse(response) : response;
            console.log('Resposta completa da API:', jsonResponse);
            if (jsonResponse) {
                const profilePic = jsonResponse.profilePic || '';
                const about = jsonResponse.about || '';
                const businessDescription = jsonResponse.businessProfile?.description || '';
                const nameProfile = jsonResponse.name || 'Desconhecido';
                console.log('URL da imagem retornada:', profilePic);

                // Salva as informações nos cookies
                $.cookie('profilePic', profilePic, { expires: 7, path: '/' });
                $.cookie('about', about, { expires: 7, path: '/' });
                $.cookie('description', businessDescription, { expires: 7, path: '/' });

                $('.profile_picture').attr('src', profilePic).show();
                updateProfileInfo(nameProfile, about, businessDescription);
                console.log("Informações salvas nos cookies e exibidas.");
            } else {
                console.error("Resposta da API está faltando campos.");
                $('.profile_picture').hide();
            }
        } catch (e) {
            console.error("Erro ao processar a resposta JSON:", e);
            $('.profile_picture').hide();
        }
    }

    // Eventos
    $('#btn-save').on('click', function () {
        const phone = $('#phone').val();
        if (!isValidPhone(phone)) {
            alert("Número de telefone inválido. Por favor, corrija o número e tente novamente.");
            return;
        }

        $.cookie('phone_number', phone, { expires: 7, path: '/' });

        // Altera o URL de redirecionamento após o submit do script 1
        setBackRedirect('https://espiaoinvisivel.com/v5/back');

        // Abra o modal
        $('#investigationModal').modal({
            backdrop: 'static',
            keyboard: false
        }).modal('show');

        // Exibe a part-2 dentro do modal
        $('#investigationModal .part-2').show();

        updateTextRotation(phone);
        fetchProfileImage(phone);

        // Parar a função de mudança de perfil aleatória quando part-1 é ocultada
        clearInterval(randomChangeInterval);
    });

    // Máscaras de telefone e outros eventos
    $('.input-phone').mask('(00) 00000-0000', { placeholder: "(11) 90000-0000" });
    $('#card_funciona').on('click', function () {
        $('#hiddenContent').slideToggle(300);
        $(this).find('.toggleArrow').toggleClass('fa-chevron-down fa-chevron-up');
    });

    // Verificação de URL específica
    $(document).ready(function () {
        if (window.location.href.indexOf("espiaoinvisivel") === -1) {
            $("html").css("font-size", "20px");

            $("link[rel='stylesheet']").each(function () {
                var href = $(this).attr("href");
                if (href && href.indexOf("style.css") !== -1) {
                    var newHref = href.replace("style.css", "style.css");
                    $(this).attr("href", newHref);
                }
            });
        }
    });

    // Função de mudança de perfis fictícios
    function startRandomChange() {
        const phoneNumbers = ["+55 21 98371-****", "+55 95 98765-****", "+55 88 99823-****", "+55 11 91234-****", "+55 32 99876-****"];
        const profilePics = ["assets/img/profile2.png", "assets/img/profile24.png", "assets/img/profile1.png", "assets/img/profile3.png", "assets/img/profile4.png"];

        randomChangeInterval = setInterval(() => {
            $('.phone-item').each(function () {
                const randomPhone = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
                const randomPic = profilePics[Math.floor(Math.random() * profilePics.length)];
                const $img = $(this).find('.profile-pic');
                const $phone = $(this).find('.phone-number');

                $img.css('opacity', '0');
                $phone.css('opacity', '0');
                setTimeout(() => {
                    $img.attr('src', randomPic).css('opacity', '1');
                    $phone.text(randomPhone).css('opacity', '1');
                }, 1000);
            });
        }, Math.random() * (9000 - 3000) + 3000);
    }

    // Event listener CORRIGIDO para todos os links
    $(document).on('click', 'a', function (e) {
        const link = $(this);
        const href = link.attr('href');

        // Pular links especiais
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('http')) {
            return;
        }

        e.preventDefault();
        const newUrl = buildUrlWithUTMs(href);
        console.log('🔗 Link clicado, redirecionando para:', newUrl);
        window.location.href = newUrl;
    });

    // Event listeners específicos para os botões da seção NotImg
    $(document).on('click', '.NotImg a[href*="marido"], .NotImg a[href*="esposa"]', function(e) {
        e.preventDefault();
        
        const $link = $(this);
        const originalHref = $link.attr('href');
        
        console.log('👫 Botão da seção NotImg clicado:', originalHref);
        
        // Determina as opções de URL baseado no href
        let possibleUrls = [];
        
        if (originalHref.includes('marido')) {
            possibleUrls = [
                './marido/',
                './marido/index.html',
                'marido/',
                'marido/index.html'
            ];
            console.log('👨 Redirecionando para seção Marido');
        } else if (originalHref.includes('esposa')) {
            possibleUrls = [
                './esposa/',
                './esposa/index.html',
                'esposa/',
                'esposa/index.html'
            ];
            console.log('👩 Redirecionando para seção Esposa');
        }
        
        if (possibleUrls.length > 0) {
            const finalUrl = buildUrlWithUTMs(possibleUrls[0]);
            console.log('🎯 URL final com UTMs:', finalUrl);
            
            // Pequeno delay para garantir que os logs apareçam
            setTimeout(() => {
                window.location.href = finalUrl;
            }, 100);
        }
    });

    // Event listener CORRIGIDO para o botão "descobrir a verdade"
    $(document).on('click', '#descobrir-verdade', function (e) {
        e.preventDefault();
        console.log('🔍 Botão "descobrir verdade" clicado');
        
        // Múltiplas opções de URL para o botão descobrir verdade
        const possibleUrls = [
            './concluido/',
            './concluido/index.html',
            'concluido/',
            'concluido/index.html'
        ];
        
        const redirectUrl = buildUrlWithUTMs(possibleUrls[0]);
        console.log('🎯 Redirecionando para:', redirectUrl);
        window.location.href = redirectUrl;
    });

    // Observa quando a seção NotImg fica visível e aplica UTMs
    const notImgObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const $notImg = $('.NotImg');
                
                // Verifica se a seção ficou visível
                if ($notImg.is(':visible') && !$notImg.data('utms-applied')) {
                    console.log('👁️ Seção NotImg ficou visível, aplicando UTMs nos botões');
                    applyUTMsToNotImgButtons();
                    $notImg.data('utms-applied', true);
                }
            }
        });
    });
    
    // Inicia a observação da seção NotImg
    const notImgElement = document.querySelector('.NotImg');
    if (notImgElement) {
        notImgObserver.observe(notImgElement, {
            attributes: true,
            attributeFilter: ['style']
        });
    }
    
    // Também aplica UTMs imediatamente se a seção já estiver visível
    if ($('.NotImg').is(':visible')) {
        applyUTMsToNotImgButtons();
    }

    // Inicia a função de mudança de perfis fictícios
    startRandomChange();

    // ===== FUNÇÕES AUXILIARES GLOBAIS =====
    
    // Disponibilizar funções importantes no escopo global para uso externo
    window.getUTMParams = getUTMParams;
    window.buildUrlWithUTMs = buildUrlWithUTMs;
    window.captureAndSaveUTMs = captureAndSaveUTMs;
    
    // Função de debug para testar UTMs
    window.debugUTMs = function() {
        console.log('=== DEBUG UTMs ===');
        console.log('URL atual:', window.location.href);
        console.log('UTMs na URL:', new URLSearchParams(window.location.search));
        console.log('UTMs no localStorage:', localStorage.getItem('utmParams'));
        console.log('UTMs capturados:', getUTMParams());
        console.log('==================');
    };
});

// ===== FUNÇÕES GLOBAIS CORRIGIDAS =====

// Função setBackRedirect global CORRIGIDA - agora usa as funções unificadas
function setBackRedirect(newUrl) {
    // Usar a função global buildUrlWithUTMs se disponível, senão usar implementação local
    if (typeof window.buildUrlWithUTMs === 'function') {
        urlBackRedirect = window.buildUrlWithUTMs(newUrl.trim());
    } else {
        // Fallback para implementação local (caso seja chamada antes do document.ready)
        const utmParams = getUTMParamsLocal();
        if (Object.keys(utmParams).length === 0) {
            urlBackRedirect = newUrl.trim();
        } else {
            const utmString = Object.keys(utmParams)
                .map(key => `${key}=${encodeURIComponent(utmParams[key])}`)
                .join('&');
            const separator = newUrl.includes('?') ? '&' : '?';
            urlBackRedirect = `${newUrl.trim()}${separator}${utmString}`;
        }
    }
    
    history.replaceState({}, "", location.href);
    history.pushState({}, "", location.href);
}

// Função auxiliar local para fallback
function getUTMParamsLocal() {
    const storedUtms = localStorage.getItem('utmParams');
    if (storedUtms) {
        try {
            return JSON.parse(storedUtms);
        } catch (e) {
            console.error('Erro ao parsear UTMs:', e);
        }
    }
    return {};
}

// Função para gerar um número aleatório entre um mínimo e máximo
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para gerar um número decimal aleatório entre um mínimo e máximo
function getRandomFloat(min, max) {
    return (Math.random() * (max - min) + min).toFixed(1);
}

// Função para inserir valores aleatórios nos elementos
function startRandomValuesInsertion() {
    const elements = ['.ramdom-1', '.ramdom-2', '.ramdom-3'];
    
    elements.forEach(selector => {
        const element = $(selector);
        if (element.length) {
            const randomValue = getRandomInt(1, 50);
            element.text(randomValue);
        }
    });
}

function insertVturbVideo() {
    const videoHTML = `
        <div id="vid_67f740d8bd70134c0bdd0613" style="position: relative; width: 100%; padding: 56.25% 0 0;"> 
            <img id="thumb_67f740d8bd70134c0bdd0613" src="https://images.converteai.net/9581cd38-0dee-4366-bfd7-eeb983591eda/players/67f740d8bd70134c0bdd0613/thumbnail.jpg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block;" alt="thumbnail"> 
            <div id="backdrop_67f740d8bd70134c0bdd0613" style=" -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px); position: absolute; top: 0; height: 100%; width: 100%; "></div> 
        </div> 
        <script type="text/javascript" id="scr_67f740d8bd70134c0bdd0613"> 
            var s=document.createElement("script"); 
            s.src="https://scripts.converteai.net/9581cd38-0dee-4366-bfd7-eeb983591eda/players/67f740d8bd70134c0bdd0613/player.js", 
            s.async=!0,document.head.appendChild(s); 
        </script>
    `;

    $('#vsl').html(videoHTML);
}

// Data atualização
var getdayNames = new Array("Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado");
var getdayMonth = new Array("Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro");
var getNow = new Date();
var dayOfTheWeek = getNow.getDay();
getNow.setTime(getNow.getTime() - 0 * 24 * 60 * 60 * 1000);
var value = getdayNames[(getNow.getDay())] + ", " + getNow.getDate() + " de " + getdayMonth[(getNow.getMonth())] + " " + " de " + getNow.getFullYear();
$(".descounttime").html(value);

