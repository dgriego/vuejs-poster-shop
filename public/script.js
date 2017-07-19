LOAD_NUM = 10;

// Basics of the Vue constructor
var store = new Vue({
  // where do you want this Vue instance to be located in the DOM
  el: '#app',

  // Instance Schema
  // data objects properties are proxied onto the Vue instance
  // making these properties available
  data: {
    total: 0,
    payLoad: {},
    items: {},
    results: [],
    cart: [],
    newSearch: 'dogs',
    lastSearch: '',
    loading: false,
    price: 9.99,
    page: 0
  },

  // computed properties
  // vue watches the dependent variables within the functions
  // and if the data changes the computed properties are re evaluated
  computed: {
    noMoreItems: function() {
      return this.payLoad.length === this.items.length;
    }
  },

  // as an example, `this` refers to the Insance of the Vue object
  methods: {
    appendItems: function() {
      if (this.items.length < this.payLoad.length) {
        var append = this.payLoad.slice(this.items.length, this.items.length + LOAD_NUM);
        this.items = this.items.concat(append);
      } else {
        return false;
      }
    },
    onSubmit: function() {
      this.items = [];
      this.loading = true;

      if(!this.newSearch) {
        this.loading = false;
        return;
      }

      this.$http
        .get(`/search/${this.newSearch}`)
        .then((response) => {
          this.payLoad = response.data;
          this.lastSearch = this.newSearch;
          this.appendItems();
          this.loading = false;
        });
    },
    addItem(index) {
      var item = this.items[index];
      var current_cart_item;

      item_list_from_cart = this.cart.filter(function(cart_item) {
        if (cart_item.id === item.id) {
          // grab reference to the matching cart_item
          current_cart_item = cart_item;

          return item;
        }
      });

      // if the item is already in the cart then increment quantity
      // and don't add item, otherwise add the item to the cart
      if (!item_list_from_cart.length) {
        this.cart.push({
          id: item.id,
          title: item.title,
          price: this.price,
          qty: 1
        });
      } else {
        current_cart_item.qty += 1;
      }

      // at last, add price of item to total
      this.total += this.price;
    },
    addToCart: function(item) {
      item.qty += 1;
      this.total += this.price;
    },
    removeFromCart: function(item) {
      if (item.qty <= 1) {
        var item_index = this.cart.indexOf(item);
        this.cart.splice(item_index, 1);
      }

      item.qty -= 1;
      this.total -= item.price;
    }
  },

  filters: {
    currency: function(price) {
      // a filter should and will always return something
      return '$'.concat(price.toFixed(2));
    }
  },

  // lifecycle hooks
  beforeCreate: function() {
    console.log('beforeCreate');
  },
  created: function() {
    console.log('created');
  },
  beforeMount: function() {
    console.log('beforeMount');
  },
  mounted: function() {
    this.onSubmit();

    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    var vueInstance = this;
    watcher.enterViewport(function() {
      // add additional items from payload
      vueInstance.appendItems();
    });
  },
  beforeUpdate: function() {
    console.log('beforeUpdate');
  },
  updated: function() {
    console.log('updated');
  },
  beforeDestroy: function() {
    console.log('beforeDestroy');
  },
  destroyed: function() {
    console.log('destroyed');
  }
});
