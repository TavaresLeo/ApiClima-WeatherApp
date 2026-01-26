# 🌦️ ApiClima - Premium Weather App

![Badge Status](http://img.shields.io/static/v1?label=STATUS&message=CONCLUÍDO&color=GREEN&style=for-the-badge)
![Badge License](http://img.shields.io/static/v1?label=LICENSE&message=MIT&color=BLUE&style=for-the-badge)
![Badge Techs](http://img.shields.io/static/v1?label=TECH&message=JAVASCRIPT%20ES6&color=YELLOW&style=for-the-badge)

## 💻 Sobre o Projeto

O **ApiClima** é uma aplicação web de previsão do tempo desenvolvida com foco em **UI/UX de alta fidelidade**. Inspirada na estética minimalista da Apple (iOS), a aplicação utiliza o conceito de **Glassmorphism** (efeito de vidro) e fundos dinâmicos que se adaptam à cidade pesquisada.

Além do visual, o projeto foi construído como um **PWA (Progressive Web App)**, permitindo que seja instalado nativamente em dispositivos móveis (Android e iOS), funcionando como um aplicativo real.

---

## 📸 Screenshots

<img width="500" height="344" alt="image" src="https://github.com/user-attachments/assets/9b7df9d3-eb05-496e-bad7-4e1c86d1e93d" />
<img width="500" height="344" alt="image" src="https://github.com/user-attachments/assets/e2e1c1ee-0846-475f-b8cd-e6b39138bb9f" />






<div align="center">
  <h3>📱 Design Mobile & Glassmorphism</h3>
  <img src="./assets/print-mobile.png" alt="Visualização Mobile" height="400">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="./assets/print-menu.png" alt="Previsão Expandida" height="400">
</div>

<br>

<div align="center">
  <h3>💻 Visualização Desktop</h3>
  <img src="./assets/print-desktop.png" alt="Visualização Desktop" width="700">
</div>

---

## ✨ Funcionalidades Principais

- **🎨 UI Dinâmica & Imersiva:**
  - O fundo da tela muda automaticamente com uma foto de alta qualidade da cidade pesquisada (via Unsplash API).
  - Interface com efeito de vidro (blur e transparência) para garantir legibilidade em qualquer fundo.
  
- **🌡️ Dados Meteorológicos Precisos:**
  - Temperatura atual em destaque.
  - Temperaturas Máxima e Mínima.
  - Umidade e Velocidade do Vento.
  - Descrição do clima (ex: "Céu limpo", "Nublado").
  
- **📅 Previsão Inteligente:**
  - Botão interativo para expandir/recolher a previsão dos próximos 5 dias.
  - Layout limpo, exibindo apenas o essencial para não poluir a tela.

- **📱 Mobile First & Responsividade:**
  - Layout totalmente adaptado para Celulares, Tablets e Desktops.
  - Ajustes finos de tipografia e espaçamento para telas pequenas (Redmi, iPhone, Samsung).
  
- **📍 Geolocalização:**
  - Botão dedicado para buscar o clima da localização atual do usuário via GPS.

- **🚀 PWA (Progressive Web App):**
  - Pode ser instalado na tela inicial do celular.
  - Abre em tela cheia (sem barra de navegador).
  - Ícone personalizado.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando tecnologias nativas e modernas:

- **HTML5** (Semântica e SEO)
- **CSS3** (Flexbox, Grid, Animations, Media Queries, Backdrop-filter)
- **JavaScript ES6+** (Async/Await, Fetch API, DOM Manipulation)
- **Manifest.json** (Configuração PWA)

### 🔌 APIs Integradas

1.  **[OpenWeatherMap](https://openweathermap.org/):** Dados de clima e previsão.
2.  **[Unsplash API](https://unsplash.com/developers):** Busca de imagens de fundo baseadas no nome da cidade.
3.  **[FlagCDN](https://flagcdn.com/):** Renderização das bandeiras dos países.

---

## 🚀 Como rodar o projeto

### Pré-requisitos
Apenas um navegador moderno (Chrome, Firefox, Edge, Safari).

### Passo a passo

1. **Clone o repositório:**
   ```bash
   https://github.com/TavaresLeo/ApiClima-WeatherApi.git
