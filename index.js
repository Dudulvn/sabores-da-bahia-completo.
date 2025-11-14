// Fundo da página
document.body.style.background = '#F5DEB3';

// Cards do menu
var itensMenu = document.querySelectorAll('.card-item');
itensMenu.forEach(function(item) {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.15) translateY(-10px)';
        this.style.zIndex = '10';
        this.style.boxShadow = '0 20px 40px rgba(226,88,34,0.3)';
    });
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.zIndex = '1';
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
    });
    item.addEventListener('click', function() {
        var titulo = this.querySelector('.titulo-item').innerText;
        var preco = this.querySelector('.preco-item').innerText;
        alert(`Você selecionou: ${titulo}\nPreço: ${preco}`);
    });
});

// Links do menu
var linksMenu = document.querySelectorAll('.link-menu');
linksMenu.forEach(function(link) {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2)';
        this.style.zIndex = '10';
        this.style.boxShadow = '0 12px 24px rgba(226,88,34,0.3)';
    });
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.zIndex = '1';
        this.style.boxShadow = 'none';
    });
});

// Unidades
var unidades = document.querySelectorAll('.card-unidade');
unidades.forEach(function(unidade) {
    unidade.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.15) translateY(-10px)';
        this.style.zIndex = '10';
        this.style.boxShadow = '0 20px 40px rgba(226,88,34,0.3)';
        this.style.background = 'linear-gradient(135deg, rgba(242,203,5,0.1), rgba(226,88,34,0.1))';
    });
    unidade.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.zIndex = '1';
        this.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
        this.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,251,245,0.85))';
    });
});

// Avaliação - barra de ambiente
var barraAmbiente = document.querySelector('input[name="ambiente"]');
var valorAmbiente = document.createElement('span');
valorAmbiente.style.marginLeft = '10px';
valorAmbiente.style.fontWeight = 'bold';
valorAmbiente.innerText = barraAmbiente.value;
barraAmbiente.parentNode.appendChild(valorAmbiente);

barraAmbiente.addEventListener('input', function() {
    var valor = parseInt(this.value);
    valorAmbiente.innerText = valor;
    var cor;
    if (valor <= 3) cor = '#E25822';
    else if (valor <= 7) cor = '#F2CB05';
    else cor = '#228B22';
    this.style.background = `linear-gradient(to right, ${cor} 0%, ${cor} ${(valor/10)*100}%, #ddd ${(valor/10)*100}%, #ddd 100%)`;
    valorAmbiente.style.color = cor;
});
