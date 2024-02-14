import { Header } from "@/components/header";
import { Alert, ScrollView, Text, View, Linking } from "react-native";
import { Product } from "@/components/product";
import { ProductCartProps, useCartStore } from "./stores/card-store";
import { formatCurrency } from "@/utils/functions/format-currency";
import { Input } from "@/components/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { LinkButton } from "@/components/link-button";
import { useState } from "react";
import { useNavigation } from "expo-router";

export default function Cart(){
  const [address, setAddress] = useState('')
  const cartStore = useCartStore();
  const navigation = useNavigation();

  const total = formatCurrency(cartStore.products.reduce((total, item) => total + item.price * item.quantity, 0))

  function handleProductRemove(product: ProductCartProps){
    Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
      {
        text: "Cancelar",
        style:  "cancel"
      },
      {
        text: "Remover",
        onPress: () => cartStore.remove(product.id),
      }
    ])
  }
  function handleAddress(text: string){
    setAddress(text);
  }
  function handleOrder(){
    if(address.trim().length === 0) return Alert.alert("Pedido", "Informe os dados da entrega!");
    
    if(cartStore.products.length > 0){
      const products = cartStore.products.map((product) => 
      `\n${product.quantity} - ${product.title}`).join("");
      const message = `🍔 *NOVO PEDIDO*\n\n*Entregar em*: ${address}\n${products}\n\nValor total: *${total}*`
      Linking.openURL(`http://api.whatsapp.com/send?phone=${process.env.PHONE_NUMBER}&text=${message}`)
      cartStore.clear()
      navigation.goBack()
    } else {
      return Alert.alert("Carinho", "Seu carrinho não possui itens para ser realizado o pedido!")
    }
  }

  return (
    <View
    className="flex-1 pt-8">
      <Header title="Seu carrinho" />
      <KeyboardAwareScrollView>
        <ScrollView>
          <View
          className="p-5 flex-1">
            {
              cartStore.products.length > 0 ? (
            <View
            className="border-b border-slate-700">
              {
                cartStore.products.map((product) => (
                  <Product key={product.id} data={product} onPress={() => handleProductRemove(product)}/>
                ))
              }
            </View>)
            : (<Text
            className="font-body text-slate-400 text-center my-8">
              Seu carrinho está vazio.
            </Text>)}
            <View 
            className="flex-row gap-2 ml-4 items-center mt-5 mb-4">
              <Text className="text-white text-xl font-subtitle">
                Total:
              </Text>
              <Text
              className="text-lime-400 text-2xl font-heading">
                {total}
              </Text>
            </View>
            <Input
            placeholder="Informe o endereço de entrega com rua, bairro, cep, número e complemento..."
            onChangeText={(text) => handleAddress(text)}
            blurOnSubmit={true}
            onSubmitEditing={handleOrder} 
            returnKeyType="next"
            />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
      <View
      className="p-5 gap-5">
        <Button onPress={handleOrder}>
          <Button.Text>
            Enviar pedido
          </Button.Text>
          <Button.Icon>
              <Feather name="arrow-right-circle" size={20}/>
          </Button.Icon>
        </Button>
        <LinkButton title="Voltar ao cardápio" href="/" />
      </View>
    </View>
  )
}