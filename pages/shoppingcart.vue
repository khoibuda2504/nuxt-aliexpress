<template>
  <MainLayout>
    <div id="ShoppingCartPage" class="mt-4 max-w-[1200px] mx-auto px-2">
      <div
        v-if="!userStore.cart.length"
        class="h-[500px] flex items-center justify-center"
      >
        <div class="pt-20">
          <img class="mx-auto" width="250" src="/cart-empty.png" />

          <div class="text-xl text-center mt-4">No items yet?</div>

          <div v-if="!user" class="flex text-center">
            <NuxtLink
              to="/auth"
              class="bg-[#FD374F] w-full text-white text-[21px] font-semibold p-1.5 rounded-full mt-4"
            >
              Sign in
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="md:flex gap-4 justify-between mx-auto w-full">
        <div class="md:w-[65%]">
          <div class="bg-white rounded-lg p-4">
            <div class="text-2xl font-bold mb-2">
              Shopping Cart ({{ userStore.cart.length }})
            </div>
          </div>


          <div id="Items" class="bg-white rounded-lg p-4 mt-4">
            <div v-for="product in userStore.cart">
              <CartItem
                :product="product"
                @selectedRadio="selectedRadioFunc"
              />
            </div>
          </div>
        </div>

        <div class="md:hidden block my-4" />
        <div class="md:w-[35%]">
          <div id="Summary" class="bg-white rounded-lg p-4">
            <div class="text-2xl font-extrabold mb-2">Summary</div>
            <div class="flex items-center justify-between my-4">
              <div class="font-semibold">Total</div>
              <div class="text-2xl font-semibold">
                $ <span class="font-extrabold">{{ totalPriceComputed }}</span>
              </div>
            </div>
            <button
              :disabled="selectedArray.length === 0"
              @click="goToCheckout"
              class="flex items-center justify-center bg-[#FD374F] w-full text-white text-[21px] font-semibold p-1.5 rounded-full mt-4"
            >
              Checkout
            </button>
            <div v-if="selectedArray.length === 0" class="mt-3 text-center text-red-500">We have to choose at least 1 item</div>
          </div>

          <div id="PaymentProtection" class="bg-white rounded-lg p-4 mt-4">
            <div class="text-lg font-semibold mb-2">Payment methods</div>
            <div class="flex items-center justify-start gap-8 my-4">
              <div v-for="card in cards">
                <img class="h-6" :src="card" />
              </div>
            </div>

            <div class="border-b" />

            <div class="text-lg font-semibold mb-2 mt-2">Buyer Protection</div>
            <p class="my-2">
              Get full refund if the item is not as described or if is not
              delivered
            </p>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "~/layouts/MainLayout.vue";
import { useUserStore } from "~/stores/user";
const userStore = useUserStore();
const user = useSupabaseUser();

let selectedArray = ref([]);

onMounted(() => {
  setTimeout(() => (userStore.isLoading = false), 200);
});

const cards = ref(["visa.png", "mastercard.png", "paypal.png", "applepay.png"]);

const cartSelected = computed(() => {
  const selectedIds = selectedArray.value.map((item) => item.id);
  return userStore.cart.filter((item) => selectedIds.includes(item.id));
});
const totalPriceComputed = computed(() => {
  let price = 0;
  cartSelected.value.forEach((prod) => {
    price += prod.price;
  });
  return price / 100;
});

const selectedRadioFunc = (e) => {
  if (selectedArray.value.length === 0) {
    selectedArray.value.push(e);
    return;
  }

  selectedArray.value.forEach((item, index) => {
    if (e.id !== item.id) {
      selectedArray.value.push(e);
    } else {
      selectedArray.value.splice(index, 1);
    }
  });
};

const goToCheckout = () => {
  userStore.checkout = [];
  userStore.checkout = cartSelected.value;
  return navigateTo("/checkout");
};
</script>
