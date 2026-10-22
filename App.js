import React, { useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

const COLORS = {
  pink: "#F7B7D2",
  pinkDark: "#D94F8C",
  pinkLight: "#FFF0F6",
  yellow: "#FFE58A",
  cream: "#FFFCF8",
  brown: "#593B43",
  muted: "#8C737B",
  white: "#FFFFFF",
  green: "#4D9B69",
  border: "#F1DDE5",
};

const PRODUCTS = [
  { id: "1", name: "Brigadeiro tradicional", category: "Brigadeiros", price: 3.5, emoji: "🍫", description: "Brigadeiro cremoso de chocolate, coberto com granulado.", rating: "4,9", reviews: 28 },
  { id: "2", name: "Brigadeiro de ninho", category: "Brigadeiros", price: 4, emoji: "🤍", description: "Brigadeiro de leite em pó, macio e docinho.", rating: "4,8", reviews: 19 },
  { id: "3", name: "Brownie recheado", category: "Brownies", price: 12, emoji: "🍪", description: "Brownie intenso de chocolate com recheio cremoso.", rating: "4,9", reviews: 34 },
  { id: "4", name: "Copo da felicidade", category: "Copos da felicidade", price: 18, emoji: "🍓", description: "Camadas de creme, bolo e morangos.", rating: "5,0", reviews: 41 },
  { id: "5", name: "Cupcake de baunilha", category: "Bolos e tortas", price: 9, emoji: "🧁", description: "Massa fofinha de baunilha com cobertura especial.", rating: "4,7", reviews: 16 },
  { id: "6", name: "Torta de chocolate", category: "Bolos e tortas", price: 14, emoji: "🍰", description: "Fatia de torta com bastante chocolate.", rating: "4,8", reviews: 22 },
  { id: "7", name: "Docinho vegano", category: "Especiais", price: 5, emoji: "🌱", description: "Opção vegana feita com ingredientes selecionados.", rating: "4,6", reviews: 9 },
  { id: "8", name: "Doce sem lactose", category: "Especiais", price: 5.5, emoji: "💗", description: "Uma opção sem lactose para adoçar seu dia.", rating: "4,7", reviews: 12 },
];

const CATEGORIES = ["Todos", "Brigadeiros", "Brownies", "Copos da felicidade", "Bolos e tortas", "Especiais"];
const money = (value) => `R$ ${value.toFixed(2).replace(".", ",")}`;

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [role, setRole] = useState("Cliente");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState("");
  const [cart, setCart] = useState([]);
  const [fulfillment, setFulfillment] = useState("Entrega");
  const [payment, setPayment] = useState("Pix");
  const [address, setAddress] = useState("");
  const [changeFor, setChangeFor] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [surpriseBag, setSurpriseBag] = useState(false);
  const [tab, setTab] = useState("Detalhes");
  const [reviewed, setReviewed] = useState([]);
  const [tickets, setTickets] = useState(0);

  const filteredProducts = useMemo(() => PRODUCTS.filter((product) => {
    const matchesCategory = category === "Todos" || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [category, search]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = fulfillment === "Entrega" && cart.length ? 5 : 0;
  const total = subtotal + deliveryFee;

  function signIn() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Faltou preencher", "Digite seu e-mail e sua senha para continuar.");
      return;
    }
    setScreen(role === "Administrador" ? "admin" : "home");
  }

  function addToCart(product, qty = 1, note = "") {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id && item.observation === note);
      if (existing) {
        return current.map((item) => item === existing ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...current, { ...product, quantity: qty, observation: note }];
    });
    setSelectedProduct(null);
    setQuantity(1);
    setObservation("");
    setScreen("home");
    Alert.alert("Adicionado ao carrinho", `${product.name} foi adicionado ao seu pedido.`);
  }

  function changeQuantity(index, delta) {
    setCart((current) => current
      .map((item, i) => i === index ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  }

  function placeOrder() {
    if (!cart.length) {
      Alert.alert("Carrinho vazio", "Adicione pelo menos um doce antes de continuar.");
      return;
    }
    if (fulfillment === "Entrega" && !address.trim()) {
      Alert.alert("Endereço necessário", "Digite o endereço de entrega ou selecione retirada.");
      return;
    }
    setOrderPlaced(true);
    setScreen("tracking");
  }

  function submitReview(productId) {
    if (reviewed.includes(productId)) return;
    setReviewed((current) => [...current, productId]);
    setTickets((current) => current + 1);
    Alert.alert("Avaliação registrada!", "Você ganhou 1 ticket de demonstração. Avalie 3 produtos para desbloquear um cupom.");
  }

  function Header({ title, back = true, right = null }) {
    return (
      <View style={styles.header}>
        {back ? <TouchableOpacity onPress={() => setScreen("home")} style={styles.backButton}><Text style={styles.backText}>‹</Text></TouchableOpacity> : <View style={{ width: 38 }} />}
        <Text style={styles.headerTitle}>{title}</Text>
        {right || <View style={{ width: 38 }} />}
      </View>
    );
  }

  function ProductCard({ product }) {
    return (
      <TouchableOpacity style={styles.productCard} onPress={() => { setSelectedProduct(product); setQuantity(1); setTab("Detalhes"); setScreen("details"); }}>
        <View style={styles.productArt}><Text style={styles.productEmoji}>{product.emoji}</Text></View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productCategory}>{product.category}</Text>
          <Text style={styles.rating}>★ {product.rating} <Text style={styles.muted}>({product.reviews})</Text></Text>
          <Text style={styles.price}>{money(product.price)}</Text>
        </View>
        <View style={styles.plus}><Text style={styles.plusText}>+</Text></View>
      </TouchableOpacity>
    );
  }

  if (screen === "welcome") {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.pinkLight} />
        <View style={styles.welcome}>
          <View style={styles.logoCircle}><Text style={styles.logoEmoji}>🍫</Text><Text style={styles.logoBow}>🎀</Text></View>
          <Text style={styles.brand}>candy crush</Text>
          <Text style={styles.tagline}>um docinho deixa tudo melhor ♡</Text>
          <View style={styles.welcomeDesserts}><Text style={styles.dessertEmoji}>🧁</Text><Text style={styles.dessertEmoji}>🍩</Text><Text style={styles.dessertEmoji}>🍓</Text></View>
          <Text style={styles.welcomeText}>Seja bem-vinda à sua doceria favorita!</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("login")}><Text style={styles.primaryButtonText}>Começar</Text></TouchableOpacity>
          <Text style={styles.smallNote}>Doces feitos para deixar seu dia mais feliz.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === "login") {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.loginPage}>
          <TouchableOpacity onPress={() => setScreen("welcome")}><Text style={styles.backText}>‹ Voltar</Text></TouchableOpacity>
          <Text style={styles.loginEmoji}>🎀</Text>
          <Text style={styles.title}>Que bom ter você aqui!</Text>
          <Text style={styles.subtitle}>Entre para escolher seus docinhos.</Text>
          <Text style={styles.fieldLabel}>Entrar como</Text>
          <View style={styles.segmentRow}>
            {["Cliente", "Administrador"].map((item) => <TouchableOpacity key={item} onPress={() => setRole(item)} style={[styles.segment, role === item && styles.segmentActive]}><Text style={[styles.segmentText, role === item && styles.segmentTextActive]}>{item}</Text></TouchableOpacity>)}
          </View>
          <Text style={styles.fieldLabel}>E-mail</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="seuemail@exemplo.com" placeholderTextColor={COLORS.muted} autoCapitalize="none" keyboardType="email-address" />
          <Text style={styles.fieldLabel}>Senha</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Digite sua senha" placeholderTextColor={COLORS.muted} secureTextEntry />
          <TouchableOpacity style={styles.primaryButton} onPress={signIn}><Text style={styles.primaryButtonText}>Entrar</Text></TouchableOpacity>
          <Text style={styles.smallNote}>Protótipo escolar: os dados de login ainda não são validados por um servidor.</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "admin") {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Painel da doceria" back={false} right={<TouchableOpacity onPress={() => setScreen("login")}><Text style={styles.link}>Sair</Text></TouchableOpacity>} />
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.title}>Olá, admin! 🍬</Text>
          <Text style={styles.subtitle}>Resumo de demonstração</Text>
          <View style={styles.statCard}><Text style={styles.statNumber}>{cart.length}</Text><Text style={styles.statLabel}>itens no carrinho atual</Text></View>
          <View style={styles.statCard}><Text style={styles.statNumber}>{PRODUCTS.length}</Text><Text style={styles.statLabel}>produtos no catálogo</Text></View>
          <Text style={styles.bodyText}>Esta é uma tela inicial para o perfil administrador. Para gerenciar pedidos e estoque de verdade, será necessário conectar uma API.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("home")}><Text style={styles.primaryButtonText}>Ver catálogo</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "home") {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.homeTop}>
            <View><Text style={styles.hello}>Oi, docinho! ♡</Text><Text style={styles.subtitle}>Qual vai ser a tentação de hoje?</Text></View>
            <TouchableOpacity style={styles.cartBubble} onPress={() => setScreen("cart")}><Text style={styles.cartIcon}>🛍️</Text>{cart.length > 0 && <View style={styles.cartCount}><Text style={styles.cartCountText}>{cart.reduce((sum, item) => sum + item.quantity, 0)}</Text></View>}</TouchableOpacity>
          </View>
          <View style={styles.promoBanner}><View style={{ flex: 1 }}><Text style={styles.promoEyebrow}>FEITO COM AMOR</Text><Text style={styles.promoTitle}>Um mimo para adoçar seu dia!</Text><Text style={styles.promoText}>Escolha seu favorito 💗</Text></View><Text style={styles.bannerEmoji}>🍰</Text></View>
          <TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder="🔎  Buscar um docinho..." placeholderTextColor={COLORS.muted} />
          <Text style={styles.sectionTitle}>Categorias</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {CATEGORIES.map((item) => <TouchableOpacity key={item} onPress={() => setCategory(item)} style={[styles.categoryChip, category === item && styles.categoryChipActive]}><Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text></TouchableOpacity>)}
          </ScrollView>
          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Nossos docinhos</Text><Text style={styles.muted}>{filteredProducts.length} itens</Text></View>
          {filteredProducts.length ? filteredProducts.map((product) => <ProductCard key={product.id} product={product} />) : <Text style={styles.emptyText}>Não encontramos esse docinho. Tente outra busca! 🍓</Text>}
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen("orders")}><Text style={styles.secondaryButtonText}>Meus pedidos e avaliações</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen("coupons")}><Text style={styles.secondaryButtonText}>Meus tickets e cupons 🎟️</Text></TouchableOpacity>
        </ScrollView>
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => setScreen("home")}><Text style={styles.navActive}>⌂{"\n"}Início</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen("orders")}><Text style={styles.navItem}>▤{"\n"}Pedidos</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen("coupons")}><Text style={styles.navItem}>♡{"\n"}Cupons</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen("cart")}><Text style={styles.navItem}>🛍️{"\n"}Carrinho</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === "details" && selectedProduct) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Detalhes do doce" />
        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.detailArt}><Text style={styles.detailEmoji}>{selectedProduct.emoji}</Text></View>
          <Text style={styles.title}>{selectedProduct.name}</Text>
          <Text style={styles.rating}>★ {selectedProduct.rating} · {selectedProduct.reviews} avaliações</Text>
          <Text style={styles.priceLarge}>{money(selectedProduct.price)}</Text>
          <View style={styles.segmentRow}>
            {["Detalhes", "Avaliações"].map((item) => <TouchableOpacity key={item} onPress={() => setTab(item)} style={[styles.segment, tab === item && styles.segmentActive]}><Text style={[styles.segmentText, tab === item && styles.segmentTextActive]}>{item}</Text></TouchableOpacity>)}
          </View>
          {tab === "Detalhes" ? <Text style={styles.bodyText}>{selectedProduct.description} Feito com carinho pela Candy Crush.</Text> : <View style={styles.reviewCard}><Text style={styles.rating}>★ {selectedProduct.rating}</Text><Text style={styles.bodyText}>“Muito gostoso, chegou direitinho!”</Text><Text style={styles.muted}>Avaliação de exemplo para o protótipo</Text></View>}
          <Text style={styles.fieldLabel}>Personalize seu pedido</Text>
          <TextInput style={[styles.input, styles.multiline]} value={observation} onChangeText={setObservation} placeholder="Ex.: sem granulado, colocar bilhetinho..." placeholderTextColor={COLORS.muted} multiline />
          <View style={styles.quantityRow}><Text style={styles.fieldLabel}>Quantidade</Text><View style={styles.quantityControls}><TouchableOpacity style={styles.qtyButton} onPress={() => setQuantity(Math.max(1, quantity - 1))}><Text style={styles.qtyText}>−</Text></TouchableOpacity><Text style={styles.qtyValue}>{quantity}</Text><TouchableOpacity style={styles.qtyButton} onPress={() => setQuantity(quantity + 1)}><Text style={styles.qtyText}>+</Text></TouchableOpacity></View></View>
          <TouchableOpacity style={styles.primaryButton} onPress={() => addToCart(selectedProduct, quantity, observation)}><Text style={styles.primaryButtonText}>Adicionar · {money(selectedProduct.price * quantity)}</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "cart") {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Meu carrinho" />
        <ScrollView contentContainerStyle={styles.page}>
          {!cart.length ? <View style={styles.emptyState}><Text style={styles.emptyEmoji}>🛍️</Text><Text style={styles.title}>Seu carrinho está vazio</Text><Text style={styles.subtitle}>Que tal escolher um docinho?</Text><TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("home")}><Text style={styles.primaryButtonText}>Explorar doces</Text></TouchableOpacity></View> : <>
            {cart.map((item, index) => <View key={`${item.id}-${index}`} style={styles.cartItem}><Text style={styles.cartProductEmoji}>{item.emoji}</Text><View style={{ flex: 1 }}><Text style={styles.productName}>{item.name}</Text><Text style={styles.muted}>{item.observation || "Sem observações"}</Text><Text style={styles.price}>{money(item.price * item.quantity)}</Text><View style={styles.quantityControls}><TouchableOpacity style={styles.qtyButton} onPress={() => changeQuantity(index, -1)}><Text style={styles.qtyText}>−</Text></TouchableOpacity><Text style={styles.qtyValue}>{item.quantity}</Text><TouchableOpacity style={styles.qtyButton} onPress={() => changeQuantity(index, 1)}><Text style={styles.qtyText}>+</Text></TouchableOpacity><TouchableOpacity onPress={() => changeQuantity(index, -item.quantity)}><Text style={styles.removeText}>Remover</Text></TouchableOpacity></View></View></View>)}
            <Text style={styles.sectionTitle}>Como você quer receber?</Text>
            <View style={styles.segmentRow}>{["Entrega", "Retirada"].map((item) => <TouchableOpacity key={item} onPress={() => setFulfillment(item)} style={[styles.segment, fulfillment === item && styles.segmentActive]}><Text style={[styles.segmentText, fulfillment === item && styles.segmentTextActive]}>{item}</Text></TouchableOpacity>)}</View>
            {fulfillment === "Entrega" && <><Text style={styles.fieldLabel}>Endereço de entrega</Text><TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Rua, número, bairro e cidade" placeholderTextColor={COLORS.muted} /></>}
            <View style={styles.surpriseCard}><Text style={styles.surpriseTitle}>🎁 Ganhe um mimo!</Text><Text style={styles.bodyText}>Sacolinha surpresa grátis em pedidos a partir de R$ 50,00.</Text><Text style={styles.muted}>{subtotal >= 50 ? "Você desbloqueou seu mimo!" : `Faltam ${money(Math.max(0, 50 - subtotal))} para ganhar seu brinde.`}</Text><TouchableOpacity disabled={subtotal < 50} onPress={() => setSurpriseBag(!surpriseBag)} style={[styles.checkRow, subtotal < 50 && styles.disabledBox]}><Text style={styles.checkMark}>{surpriseBag ? "☑" : "□"}</Text><Text style={styles.bodyText}>Incluir sacolinha surpresa grátis</Text></TouchableOpacity></View>
            {surpriseBag && subtotal >= 50 && <View style={styles.summaryRow}><Text>Sacolinha surpresa</Text><Text style={styles.price}>{money(0)}</Text></View>}
            <View style={styles.summaryRow}><Text>Subtotal</Text><Text>{money(subtotal)}</Text></View><View style={styles.summaryRow}><Text>Taxa de entrega</Text><Text>{money(deliveryFee)}</Text></View><View style={styles.summaryRowTotal}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{money(total)}</Text></View>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("checkout")}><Text style={styles.primaryButtonText}>Ir para o pagamento</Text></TouchableOpacity>
          </>}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "checkout") {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Pagamento" />
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.title}>Quase lá! 💗</Text><Text style={styles.subtitle}>Confira os dados e escolha como pagar.</Text>
          <View style={styles.summaryCard}><Text style={styles.sectionTitle}>Seu pedido</Text>{cart.map((item, i) => <View key={`${item.id}-${i}`} style={styles.summaryRow}><Text style={styles.summaryItem}>{item.quantity}× {item.name}</Text><Text>{money(item.price * item.quantity)}</Text></View>)}<View style={styles.summaryRow}><Text>Recebimento</Text><Text>{fulfillment}</Text></View>{fulfillment === "Entrega" && <Text style={styles.muted}>{address || "Endereço não informado"}</Text>}<View style={styles.summaryRowTotal}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{money(total)}</Text></View></View>
          <Text style={styles.sectionTitle}>Forma de pagamento</Text>
          {["Pix", "Cartão de crédito", "Cartão de débito", "Dinheiro"].map((item) => <TouchableOpacity key={item} style={[styles.paymentOption, payment === item && styles.paymentSelected]} onPress={() => setPayment(item)}><Text style={styles.paymentRadio}>{payment === item ? "🔘" : "⚪"}</Text><Text style={styles.bodyText}>{item}</Text></TouchableOpacity>)}
          {payment === "Dinheiro" && <><Text style={styles.fieldLabel}>Troco para quanto? (opcional)</Text><TextInput style={styles.input} value={changeFor} onChangeText={setChangeFor} placeholder="Ex.: R$ 50,00" placeholderTextColor={COLORS.muted} keyboardType="decimal-pad" /></>}
          {payment === "Pix" && <View style={styles.pixInfo}><Text style={styles.pixTitle}>Pix de demonstração</Text><Text style={styles.bodyText}>Ao confirmar, o app mostrará uma tela ilustrativa. Este protótipo não gera cobrança Pix real.</Text></View>}
          <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("review")}><Text style={styles.primaryButtonText}>Revisar pedido</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "review") {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Revisão do pedido" />
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.title}>Tudo certinho? 🍬</Text>
          <View style={styles.summaryCard}><Text style={styles.sectionTitle}>Resumo</Text><Text style={styles.bodyText}>Forma de recebimento: {fulfillment}</Text>{fulfillment === "Entrega" && <Text style={styles.bodyText}>Endereço: {address}</Text>}<Text style={styles.bodyText}>Pagamento: {payment}</Text>{payment === "Dinheiro" && changeFor ? <Text style={styles.bodyText}>Troco para: {changeFor}</Text> : null}<View style={styles.divider}/>{cart.map((item, i) => <View key={`${item.id}-${i}`} style={styles.summaryRow}><Text style={styles.summaryItem}>{item.quantity}× {item.name}</Text><Text>{money(item.price * item.quantity)}</Text></View>)}<View style={styles.summaryRow}><Text>Entrega</Text><Text>{money(deliveryFee)}</Text></View>{surpriseBag && <Text style={styles.bodyText}>🎁 Sacolinha surpresa grátis</Text>}<View style={styles.summaryRowTotal}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{money(total)}</Text></View></View>
          <TouchableOpacity style={styles.primaryButton} onPress={placeOrder}><Text style={styles.primaryButtonText}>Confirmar pedido</Text></TouchableOpacity>
          <Text style={styles.smallNote}>A confirmação registra apenas um pedido de demonstração neste aparelho.</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "tracking") {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Acompanhar pedido" back={false} />
        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.successCircle}><Text style={styles.successEmoji}>💗</Text></View>
          <Text style={styles.titleCentered}>Pedido confirmado!</Text><Text style={styles.subtitleCentered}>Seu docinho já entrou na nossa lista.</Text>
          <View style={styles.trackingCard}>
            {[["✓", "Pedido recebido", "Recebemos seu pedido."], ["●", "Em preparação", "Estamos preparando tudo com carinho."], ["○", "Saiu para entrega", fulfillment === "Retirada" ? "Seu pedido ficará pronto para retirada." : "Avisaremos quando sair."], ["○", "Entregue", "Bom apetite!"]].map((step, i) => <View key={step[1]} style={styles.trackRow}><View style={[styles.trackDot, i < 2 && styles.trackDotActive]}><Text style={styles.trackDotText}>{step[0]}</Text></View><View style={{ flex: 1 }}><Text style={styles.trackTitle}>{step[1]}</Text><Text style={styles.muted}>{step[2]}</Text></View></View>)}
          </View>
          <View style={styles.pixInfo}><Text style={styles.pixTitle}>{payment === "Pix" ? "Pix selecionado" : `Pagamento: ${payment}`}</Text><Text style={styles.bodyText}>{payment === "Pix" ? "QR Code e cobrança reais precisam ser integrados a um provedor de pagamentos." : "Pagamento registrado apenas para demonstração."}</Text></View>
          <TouchableOpacity style={styles.primaryButton} onPress={() => { setCart([]); setSurpriseBag(false); setOrderPlaced(false); setScreen("home"); }}><Text style={styles.primaryButtonText}>Voltar para a loja</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "orders") {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Meus pedidos" />
        <ScrollView contentContainerStyle={styles.page}>
          {orderPlaced ? <View style={styles.summaryCard}><Text style={styles.sectionTitle}>Pedido recente</Text><Text style={styles.bodyText}>Status: pedido confirmado (demonstração)</Text><TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen("tracking")}><Text style={styles.secondaryButtonText}>Acompanhar pedido</Text></TouchableOpacity></View> : <View style={styles.emptyState}><Text style={styles.emptyEmoji}>🍰</Text><Text style={styles.title}>Ainda não há pedidos</Text><Text style={styles.subtitle}>Seus pedidos aparecerão aqui.</Text></View>}
          <Text style={styles.sectionTitle}>Avalie os produtos</Text><Text style={styles.bodyText}>Avaliações de demonstração geram tickets. Avalie 3 produtos para desbloquear um cupom.</Text>
          {PRODUCTS.slice(0, 5).map((product) => <View key={product.id} style={styles.reviewCard}><View style={styles.reviewHeader}><Text style={styles.productName}>{product.emoji} {product.name}</Text><Text style={styles.rating}>★ {product.rating}</Text></View><TouchableOpacity style={[styles.smallAction, reviewed.includes(product.id) && styles.actionDone]} onPress={() => submitReview(product.id)} disabled={reviewed.includes(product.id)}><Text style={styles.smallActionText}>{reviewed.includes(product.id) ? "Avaliado ✓" : "Avaliar + ganhar ticket"}</Text></TouchableOpacity></View>)}
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen("home")}><Text style={styles.secondaryButtonText}>Voltar à loja</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "coupons") {
    const couponUnlocked = tickets >= 3;
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Tickets e cupons" />
        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.couponHero}><Text style={styles.couponEmoji}>🎟️</Text><Text style={styles.title}>Clube do docinho</Text><Text style={styles.subtitle}>Avalie produtos e junte tickets!</Text><Text style={styles.ticketNumber}>{tickets} / 3 tickets</Text><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.min(100, tickets / 3 * 100)}%` }]} /></View></View>
          <View style={styles.couponCard}><Text style={styles.couponEmoji}>💝</Text><Text style={styles.sectionTitle}>{couponUnlocked ? "Cupom desbloqueado!" : "Seu próximo mimo"}</Text><Text style={styles.bodyText}>{couponUnlocked ? "CUPOMDOCE — cupom demonstrativo de desconto." : `Faltam ${3 - tickets} avaliação(ões) para desbloquear um cupom.`}</Text><TouchableOpacity style={[styles.primaryButton, !couponUnlocked && styles.disabledButton]} disabled={!couponUnlocked} onPress={() => Alert.alert("Cupom de demonstração", "Este cupom ainda não está conectado ao sistema de pedidos.")}><Text style={styles.primaryButtonText}>{couponUnlocked ? "Resgatar cupom" : "Ainda bloqueado"}</Text></TouchableOpacity></View>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen("orders")}><Text style={styles.secondaryButtonText}>Ir para avaliações</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}
  
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },

  welcome: {
    flex: 1,
    backgroundColor: COLORS.cream,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  logoCircle: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: COLORS.pinkLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.pink,
    marginBottom: 25,
  },
  logoEmoji: { fontSize: 60 },
  logoBow: { position: "absolute", right: 8, top: 7, fontSize: 27 },
  brand: {
    fontSize: 38,
    fontWeight: "900",
    color: COLORS.brown,
    letterSpacing: -1.5,
  },
  tagline: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  welcomeDesserts: {
    flexDirection: "row",
    gap: 24,
    marginVertical: 35,
  },
  dessertEmoji: { fontSize: 38 },
  welcomeText: {
    color: COLORS.brown,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 24,
  },
  smallNote: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 14,
  },

  primaryButton: {
    backgroundColor: COLORS.brown,
    borderRadius: 12,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    marginTop: 18,
    width: "100%",
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  loginPage: { padding: 24, paddingBottom: 40 },
  loginEmoji: { fontSize: 42, marginTop: 32, marginBottom: 10 },
  title: {
    color: COLORS.brown,
    fontSize: 26,
    fontWeight: "800",
    marginTop: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 7,
    marginBottom: 18,
    lineHeight: 21,
  },
  fieldLabel: {
    color: COLORS.brown,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 17,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: COLORS.brown,
    backgroundColor: COLORS.white,
    fontSize: 14,
  },
  multiline: { minHeight: 90, textAlignVertical: "top" },

  segmentRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    marginBottom: 12,
  },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 13,
  },
  segmentActive: {
    backgroundColor: COLORS.pinkLight,
    borderColor: COLORS.pinkDark,
  },
  segmentText: {
    color: COLORS.muted,
    fontWeight: "600",
    fontSize: 13,
  },
  segmentTextActive: {
    color: COLORS.brown,
    fontWeight: "800",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: COLORS.cream,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  backText: { color: COLORS.pinkDark, fontSize: 27, fontWeight: "600" },
  headerTitle: {
    color: COLORS.brown,
    fontSize: 16,
    fontWeight: "800",
  },
  page: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 35 },

  homeTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  hello: {
    color: COLORS.brown,
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: -0.7,
  },
  cartBubble: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.pinkLight,
    alignItems: "center",
    justifyContent: "center",
  },
  cartIcon: { fontSize: 21 },
  cartCount: {
    position: "absolute",
    right: -3,
    top: -3,
    backgroundColor: COLORS.pinkDark,
    borderRadius: 10,
    minWidth: 19,
    height: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  cartCountText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "800",
  },

  promoBanner: {
    backgroundColor: COLORS.pinkLight,
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  promoEyebrow: {
    color: COLORS.pinkDark,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.6,
  },
  promoTitle: {
    color: COLORS.brown,
    fontSize: 19,
    fontWeight: "800",
    marginTop: 8,
    maxWidth: 230,
    lineHeight: 25,
  },
  promoText: { color: COLORS.muted, fontSize: 12, marginTop: 7 },
  bannerEmoji: { fontSize: 48, marginLeft: 5 },

  searchInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: COLORS.brown,
    marginBottom: 20,
    fontSize: 13,
  },
  sectionTitle: {
    color: COLORS.brown,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 12,
  },
  categoryRow: { gap: 8, paddingBottom: 17 },
  categoryChip: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  categoryChipActive: {
    backgroundColor: COLORS.brown,
    borderColor: COLORS.brown,
  },
  categoryText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: COLORS.white,
    fontWeight: "800",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 11,
    marginBottom: 12,
  },
  productArt: {
    width: 82,
    height: 88,
    borderRadius: 12,
    backgroundColor: COLORS.pinkLight,
    alignItems: "center",
    justifyContent: "center",
  },
  productEmoji: { fontSize: 37 },
  productInfo: { flex: 1, paddingHorizontal: 12 },
  productName: {
    color: COLORS.brown,
    fontWeight: "800",
    fontSize: 13,
    lineHeight: 19,
  },
  productCategory: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },
  rating: {
    color: "#A17B40",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 5,
  },
  muted: { color: COLORS.muted, fontSize: 11, lineHeight: 16 },
  price: {
    color: COLORS.pinkDark,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 5,
  },
  plus: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.brown,
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: "600",
    marginTop: -2,
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 11,
    paddingBottom: 13,
  },
  navItem: {
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
  },
  navActive: {
    textAlign: "center",
    color: COLORS.pinkDark,
    fontSize: 11,
    lineHeight: 18,
    fontWeight: "800",
  },
  emptyText: { color: COLORS.muted, textAlign: "center", padding: 25 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingHorizontal: 12,
  },
  secondaryButtonText: {
    color: COLORS.brown,
    fontWeight: "800",
    fontSize: 13,
  },

  detailArt: {
    height: 220,
    backgroundColor: COLORS.pinkLight,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailEmoji: { fontSize: 95 },
  priceLarge: {
    color: COLORS.pinkDark,
    fontSize: 25,
    fontWeight: "900",
    marginTop: 9,
  },
  bodyText: {
    color: COLORS.brown,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
  },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.pinkLight,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { color: COLORS.pinkDark, fontSize: 20, fontWeight: "800" },
  qtyValue: {
    color: COLORS.brown,
    fontSize: 15,
    fontWeight: "800",
    minWidth: 16,
    textAlign: "center",
  },

  cartItem: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    padding: 13,
    marginBottom: 11,
  },
  cartProductEmoji: { fontSize: 38, alignSelf: "flex-start" },
  removeText: {
    color: COLORS.pinkDark,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 5,
  },
  surpriseCard: {
    backgroundColor: "#F8F0DE",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E9D8B4",
    padding: 15,
    marginTop: 20,
    marginBottom: 12,
  },
  surpriseTitle: {
    color: COLORS.brown,
    fontSize: 16,
    fontWeight: "900",
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  checkMark: { color: COLORS.green, fontSize: 24, fontWeight: "900" },
  disabledBox: { opacity: 0.4 },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  summaryRowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    marginTop: 4,
  },
  totalLabel: { color: COLORS.brown, fontSize: 16, fontWeight: "900" },
  totalValue: { color: COLORS.pinkDark, fontSize: 21, fontWeight: "900" },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginTop: 10,
  },
  summaryItem: { color: COLORS.brown, flex: 1, fontSize: 13 },

  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginTop: 9,
  },
  paymentSelected: {
    borderColor: COLORS.pinkDark,
    backgroundColor: COLORS.pinkLight,
  },
  paymentRadio: { fontSize: 16 },
  pixInfo: {
    backgroundColor: COLORS.pinkLight,
    borderRadius: 13,
    padding: 15,
    marginTop: 14,
  },
  pixTitle: { color: COLORS.pinkDark, fontWeight: "900", fontSize: 14 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },

  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyEmoji: { fontSize: 50, marginBottom: 10 },
  successCircle: {
    alignSelf: "center",
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: COLORS.pinkLight,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  successEmoji: { fontSize: 43 },
  titleCentered: {
    color: COLORS.brown,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 15,
  },
  subtitleCentered: {
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  trackingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  trackRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
    alignItems: "flex-start",
  },
  trackDot: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: "#EEE7E2",
    alignItems: "center",
    justifyContent: "center",
  },
  trackDotActive: { backgroundColor: COLORS.pink },
  trackDotText: { color: COLORS.brown, fontWeight: "900" },
  trackTitle: { color: COLORS.brown, fontSize: 14, fontWeight: "800" },

  statCard: {
    backgroundColor: COLORS.pinkLight,
    padding: 20,
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statNumber: { color: COLORS.pinkDark, fontSize: 30, fontWeight: "900" },
  statLabel: { color: COLORS.brown, fontSize: 13, marginTop: 4 },
  link: { color: COLORS.pinkDark, fontWeight: "700" },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  smallAction: {
    backgroundColor: COLORS.pinkLight,
    padding: 11,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  actionDone: { backgroundColor: "#E4EEE5" },
  smallActionText: {
    color: COLORS.pinkDark,
    fontSize: 12,
    fontWeight: "800",
  },

  couponHero: {
    backgroundColor: COLORS.pinkLight,
    borderRadius: 18,
    alignItems: "center",
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  couponEmoji: { fontSize: 40, marginBottom: 5 },
  ticketNumber: {
    color: COLORS.pinkDark,
    fontSize: 23,
    fontWeight: "900",
    marginTop: 12,
  },
  progressTrack: {
    width: "100%",
    height: 9,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.pinkDark,
    borderRadius: 8,
  },
  couponCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 18,
  },
  disabledButton: { opacity: 0.45 },
});