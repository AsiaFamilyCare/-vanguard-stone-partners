const products = [
  {id:1,name:'Calacatta Gold Marble 3CM',category:'Marble',price:2999,oldPrice:3899,stock:8,badge:'Sale',image:'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80'},
  {id:2,name:'Titanium Quartzite 3CM',category:'Quartzite',price:3499,oldPrice:4250,stock:5,badge:'Sale',image:'https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=900&q=80'},
  {id:3,name:'Nero Marquina Marble 2CM',category:'Marble',price:2199,oldPrice:null,stock:2,badge:'New',image:'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80'},
  {id:4,name:'Taj Mahal Quartzite 3CM',category:'Quartzite',price:2749,oldPrice:null,stock:0,badge:'Out of Stock',image:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80'},
  {id:5,name:'Absolute Black Granite 3CM',category:'Granite',price:1849,oldPrice:2099,stock:12,badge:'Sale',image:'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80'},
  {id:6,name:'Bianco Superiore Quartz 3CM',category:'Quartz',price:1950,oldPrice:null,stock:7,badge:'',image:'https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&w=900&q=80'},
  {id:7,name:'Onyx Verde Semi-Precious',category:'Semi-Precious',price:4899,oldPrice:5299,stock:1,badge:'Limited',image:'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=900&q=80'},
  {id:8,name:'Statuario Porcelain 12MM',category:'Porcelain',price:1317,oldPrice:1592,stock:9,badge:'Sale',image:'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=900&q=80'}
];
const categories = [
  ['Granite','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80'],
  ['Marble','https://images.unsplash.com/photo-1615529162924-f8605388461d?auto=format&fit=crop&w=700&q=80'],
  ['Quartz','https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80'],
  ['Quartzite','https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=700&q=80'],
  ['Porcelain','https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=700&q=80'],
  ['Semi-Precious','https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=80']
];

const productGrid=document.getElementById('productGrid');
const categoryGrid=document.getElementById('categoryGrid');
const categoryFilter=document.getElementById('categoryFilter');
const sortFilter=document.getElementById('sortFilter');
let cart=JSON.parse(localStorage.getItem('stoneVaultCart')||'[]');

categories.forEach(([name,img])=>{
  const card=document.createElement('div'); card.className='category-card';
  card.innerHTML=`<img src="${img}" alt="${name}"><span>${name}</span>`;
  card.onclick=()=>{categoryFilter.value=name; renderProducts(); document.getElementById('shop').scrollIntoView();};
  categoryGrid.appendChild(card);
  categoryFilter.insertAdjacentHTML('beforeend',`<option value="${name}">${name}</option>`);
});

function money(n){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n)}
function stockText(stock){if(stock===0)return ['Out of Stock','out']; if(stock<=2)return [`Only ${stock} Left`,'low']; return [`In Stock (${stock})`,'in'];}
function renderProducts(){
  let list=[...products]; const cat=categoryFilter.value;
  if(cat!=='all') list=list.filter(p=>p.category===cat);
  if(sortFilter.value==='price-low') list.sort((a,b)=>a.price-b.price);
  if(sortFilter.value==='price-high') list.sort((a,b)=>b.price-a.price);
  if(sortFilter.value==='stock') list.sort((a,b)=>b.stock-a.stock);
  productGrid.innerHTML='';
  list.forEach(p=>{
    const [sText,sClass]=stockText(p.stock);
    const el=document.createElement('article'); el.className='product-card';
    el.innerHTML=`<div class="product-image"><img src="${p.image}" alt="${p.name}">${p.badge?`<span class="badge ${p.badge==='Sale'?'sale':p.stock===0?'out':''}">${p.badge}</span>`:''}</div><div class="product-body"><div class="product-meta">${p.category}</div><h3>${p.name}</h3><div class="price-row">${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:''}<span class="price">${money(p.price)}</span></div><div class="stock ${sClass}">${sText}</div><button ${p.stock===0?'disabled':''} data-id="${p.id}">${p.stock===0?'Sold Out':'Add to Cart'}</button></div>`;
    productGrid.appendChild(el);
  });
  productGrid.querySelectorAll('button[data-id]').forEach(btn=>btn.addEventListener('click',()=>addToCart(Number(btn.dataset.id))));
}
categoryFilter.onchange=renderProducts; sortFilter.onchange=renderProducts;

function addToCart(id){
  const p=products.find(x=>x.id===id); if(!p||p.stock===0)return;
  const line=cart.find(x=>x.id===id);
  if(line){ if(line.qty<p.stock) line.qty++; } else cart.push({id,qty:1});
  saveCart(); openCart();
}
function saveCart(){localStorage.setItem('stoneVaultCart',JSON.stringify(cart)); renderCart();}
function renderCart(){
  const box=document.getElementById('cartItems'); box.innerHTML='';
  let total=0,count=0;
  if(!cart.length) box.innerHTML='<div class="empty">Your cart is empty.</div>';
  cart.forEach(line=>{const p=products.find(x=>x.id===line.id); if(!p)return; total+=p.price*line.qty; count+=line.qty; const div=document.createElement('div');div.className='cart-item';div.innerHTML=`<img src="${p.image}" alt=""><div><strong>${p.name}</strong><small>Qty ${line.qty} · ${money(p.price)}</small></div><button data-remove="${p.id}">Remove</button>`;box.appendChild(div)});
  box.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==Number(b.dataset.remove));saveCart()});
  document.getElementById('cartCount').textContent=count; document.getElementById('cartTotal').textContent=money(total);
}
const drawer=document.getElementById('cartDrawer'),backdrop=document.getElementById('drawerBackdrop');
function openCart(){drawer.classList.add('open');backdrop.classList.add('open');drawer.setAttribute('aria-hidden','false')}
function closeCart(){drawer.classList.remove('open');backdrop.classList.remove('open');drawer.setAttribute('aria-hidden','true')}
document.getElementById('cartButton').onclick=openCart; document.getElementById('closeCart').onclick=closeCart; backdrop.onclick=closeCart;
document.getElementById('checkoutButton').onclick=()=>alert('Demo checkout only. Connect Square, Shopify, Stripe, or another payment provider before launch.');
renderProducts();renderCart();
