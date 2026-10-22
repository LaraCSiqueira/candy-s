# Candy Crush — protótipo React Native + Expo

## Requisitos
- Node.js versão LTS
- VS Code
- Internet

## Como executar
1. Extraia o ZIP.
2. Abra a pasta `candy_crush_expo` no VS Code.
3. Abra Terminal > Novo Terminal.
4. Execute `npm install`.
5. Execute `npx expo start`.
6. Para testar no celular, instale o Expo Go e leia o QR code. O computador e o celular devem estar na mesma rede Wi-Fi.
7. Para testar no navegador, pressione `w` no terminal do Expo, se a plataforma web estiver disponível.

## O que este protótipo já tem
- Abertura e login demonstrativo Cliente/Administrador
- Catálogo com categorias e busca
- Detalhes, observações, quantidade e avaliações de exemplo
- Carrinho com editar/remover quantidade
- Entrega/retirada, endereço e taxa demonstrativa
- Sacolinha surpresa a partir de R$ 50
- Escolha de forma de pagamento e revisão
- Confirmação e rastreamento ilustrativo
- Tickets e cupons demonstrativos

## Limitações importantes
Os dados são mantidos apenas em memória enquanto o app está aberto. O login não autentica de verdade, não há backend, pagamentos reais, QR Code Pix real nem rastreamento em tempo real. Não use dados reais de clientes neste protótipo.

## Próximos passos
1. Conectar uma API/backend.
2. Implementar autenticação segura.
3. Salvar carrinho e pedidos com AsyncStorage ou banco de dados.
4. Integrar um provedor de pagamento para Pix/cartões.
5. Fazer avaliações reais e regras de cupons no servidor.
