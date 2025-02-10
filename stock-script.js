class StockManagement {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('stockItems')) || [];
        this.sales = JSON.parse(localStorage.getItem('salesRecords')) || [];
        this.purchases = JSON.parse(localStorage.getItem('purchaseRecords')) || [];
        this.customers = JSON.parse(localStorage.getItem('customers')) || {};
        this.payments = JSON.parse(localStorage.getItem('paymentRecords')) || [];
        this.lastSaleInvoice = parseInt(localStorage.getItem('lastSaleInvoice')) || 0;
        this.lastPurchaseInvoice = parseInt(localStorage.getItem('lastPurchaseInvoice')) || 0;
        this.discounts = {
            walkin: 0,
            regular: 5,
            wholesale: 10,
            vip: 15
        };
        this.initializeElements();
        this.addEventListeners();
        this.render();
    }

    initializeElements() {
        // Buttons
        this.addItemBtn = document.getElementById('add-item-btn');
        this.addSaleBtn = document.getElementById('add-sale-btn');
        this.addPurchaseBtn = document.getElementById('add-purchase-btn');
        
        // Modals
        this.itemModal = document.getElementById('item-modal');
        this.saleModal = document.getElementById('sale-modal');
        this.purchaseModal = document.getElementById('purchase-modal');
        this.closeButtons = document.querySelectorAll('.close');
        this.paymentModal = document.getElementById('payment-modal');
        
        // Forms
        this.itemForm = document.getElementById('item-form');
        this.saleForm = document.getElementById('sale-form');
        this.purchaseForm = document.getElementById('purchase-form');
        this.paymentForm = document.getElementById('payment-form');
        
        // Item form elements
        this.itemIdInput = document.getElementById('item-id');
        this.itemNameInput = document.getElementById('item-name');
        this.itemCategoryInput = document.getElementById('item-category');
        this.itemQuantityInput = document.getElementById('item-quantity');
        this.itemPriceInput = document.getElementById('item-price');
        
        // Sale form elements
        this.saleItemSelect = document.getElementById('sale-item');
        this.saleQuantityInput = document.getElementById('sale-quantity');
        this.salePriceInput = document.getElementById('sale-price');
        this.customerTypeSelect = document.getElementById('customer-type');
        this.customerNameInput = document.getElementById('customer-name');
        this.customerInfoGroup = document.getElementById('customer-info-group');
        this.customerPhoneInput = document.getElementById('customer-phone');
        this.customerEmailInput = document.getElementById('customer-email');
        this.saleInvoiceInput = document.getElementById('sale-invoice');
        this.paymentMethodSelect = document.getElementById('payment-method');
        this.paymentStatusSelect = document.getElementById('payment-status');
        this.paidAmountGroup = document.getElementById('paid-amount-group');
        this.paidAmountInput = document.getElementById('paid-amount');
        
        // Purchase form elements
        this.purchaseItemSelect = document.getElementById('purchase-item');
        this.purchaseQuantityInput = document.getElementById('purchase-quantity');
        this.purchasePriceInput = document.getElementById('purchase-price');
        this.supplierNameInput = document.getElementById('supplier-name');
        this.purchaseInvoiceInput = document.getElementById('purchase-invoice');
        this.purchasePaymentMethodSelect = document.getElementById('purchase-payment-method');
        this.purchasePaymentStatusSelect = document.getElementById('purchase-payment-status');
        this.purchasePaidAmountGroup = document.getElementById('purchase-paid-amount-group');
        this.purchasePaidAmountInput = document.getElementById('purchase-paid-amount');
        
        // Payment form elements
        this.paymentTransactionId = document.getElementById('payment-transaction-id');
        this.paymentTransactionType = document.getElementById('payment-transaction-type');
        this.paymentInvoiceDisplay = document.getElementById('payment-invoice-display');
        this.paymentTotalAmount = document.getElementById('payment-total-amount');
        this.paymentAmountPaid = document.getElementById('payment-amount-paid');
        this.paymentAmountDue = document.getElementById('payment-amount-due');
        this.paymentNewAmount = document.getElementById('payment-new-amount');
        this.paymentNewMethod = document.getElementById('payment-new-method');
        this.paymentTaxDeduction = document.getElementById('payment-tax-deduction');
        this.taxAmountDisplay = document.getElementById('tax-amount-display');
        this.netAmountDisplay = document.getElementById('net-amount-display');
        this.bankDetailsGroup = document.getElementById('bank-details-group');
        this.paymentBankName = document.getElementById('payment-bank-name');
        this.paymentCheckNumber = document.getElementById('payment-check-number');
        this.paymentTransactionRef = document.getElementById('payment-transaction-ref');
        
        // Search and filter elements
        this.searchInput = document.getElementById('search-input');
        this.categoryFilter = document.getElementById('category-filter');
        this.salesSearch = document.getElementById('sales-search');
        this.salesDateFilter = document.getElementById('sales-date-filter');
        this.purchasesSearch = document.getElementById('purchases-search');
        this.purchasesDateFilter = document.getElementById('purchases-date-filter');
        
        // Lists
        this.stockList = document.getElementById('stock-list');
        this.salesList = document.getElementById('sales-list');
        this.purchasesList = document.getElementById('purchases-list');
        
        // Tabs
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
    }

    addEventListeners() {
        // Modal events
        this.addItemBtn.addEventListener('click', () => this.openModal('item'));
        this.addSaleBtn.addEventListener('click', () => this.openModal('sale'));
        this.addPurchaseBtn.addEventListener('click', () => this.openModal('purchase'));
        
        this.closeButtons.forEach(button => {
            button.addEventListener('click', () => this.closeModals());
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });

        // Form submissions
        this.itemForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveItem();
        });

        this.saleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.recordSale();
        });

        this.purchaseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.recordPurchase();
        });

        this.paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.recordPayment();
        });

        // Search and filter
        this.searchInput.addEventListener('input', () => this.render());
        this.categoryFilter.addEventListener('change', () => this.render());
        this.salesSearch.addEventListener('input', () => this.render());
        this.salesDateFilter.addEventListener('change', () => this.render());
        this.purchasesSearch.addEventListener('input', () => this.render());
        this.purchasesDateFilter.addEventListener('change', () => this.render());

        // Tab switching
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.switchTab(button.dataset.tab);
            });
        });

        // Dynamic price update for sales
        this.saleItemSelect.addEventListener('change', () => {
            const selectedItem = this.items.find(item => item.id === this.saleItemSelect.value);
            if (selectedItem) {
                this.salePriceInput.value = selectedItem.price;
            }
        });

        // Customer type change handler
        this.customerTypeSelect.addEventListener('change', () => {
            const type = this.customerTypeSelect.value;
            this.customerInfoGroup.style.display = type === 'walkin' ? 'none' : 'block';
            
            // Update price with discount
            const selectedItem = this.items.find(item => item.id === this.saleItemSelect.value);
            if (selectedItem) {
                const discount = this.discounts[type];
                const originalPrice = selectedItem.price;
                const discountedPrice = originalPrice * (1 - discount / 100);
                this.salePriceInput.value = discountedPrice.toFixed(2);
            }
        });

        // Customer name input handler for auto-fill
        this.customerNameInput.addEventListener('input', () => {
            const name = this.customerNameInput.value.trim().toLowerCase();
            const customerInfo = this.customers[name];
            
            if (customerInfo) {
                this.customerTypeSelect.value = customerInfo.type;
                this.customerPhoneInput.value = customerInfo.phone || '';
                this.customerEmailInput.value = customerInfo.email || '';
                this.customerInfoGroup.style.display = customerInfo.type === 'walkin' ? 'none' : 'block';
                
                // Update price with saved customer type discount
                const selectedItem = this.items.find(item => item.id === this.saleItemSelect.value);
                if (selectedItem) {
                    const discount = this.discounts[customerInfo.type];
                    const originalPrice = selectedItem.price;
                    const discountedPrice = originalPrice * (1 - discount / 100);
                    this.salePriceInput.value = discountedPrice.toFixed(2);
                }
            }
        });

        // Payment status change handlers
        this.paymentStatusSelect.addEventListener('change', () => {
            this.paidAmountGroup.style.display = 
                this.paymentStatusSelect.value === 'partial' ? 'block' : 'none';
        });

        this.purchasePaymentStatusSelect.addEventListener('change', () => {
            this.purchasePaidAmountGroup.style.display = 
                this.purchasePaymentStatusSelect.value === 'partial' ? 'block' : 'none';
        });

        // Payment method change handler
        this.paymentNewMethod.addEventListener('change', () => {
            const showBankDetails = ['bank', 'check'].includes(this.paymentNewMethod.value);
            this.bankDetailsGroup.style.display = showBankDetails ? 'block' : 'none';
            
            if (showBankDetails) {
                this.paymentBankName.required = true;
                if (this.paymentNewMethod.value === 'check') {
                    this.paymentCheckNumber.required = true;
                }
            } else {
                this.paymentBankName.required = false;
                this.paymentCheckNumber.required = false;
            }
        });

        // Tax calculation handlers
        this.paymentTaxDeduction.addEventListener('input', () => this.updateTaxCalculation());
        this.paymentNewAmount.addEventListener('input', () => this.updateTaxCalculation());
    }

    switchTab(tabId) {
        this.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
    }

    openModal(type, transactionId = null) {
        this.closeModals();
        if (transactionId && type === 'payment') {
            const transaction = this.sales.find(s => s.id === transactionId) || 
                              this.purchases.find(p => p.id === transactionId);
            if (transaction) {
                this.paymentModal.style.display = 'block';
                this.paymentTransactionId.value = transactionId;
                this.paymentTransactionType.value = transaction.type;
                this.paymentInvoiceDisplay.value = transaction.invoiceNumber;
                this.paymentTotalAmount.value = transaction.totalAmount;
                this.paymentAmountPaid.value = transaction.amountPaid || 0;
                this.paymentAmountDue.value = transaction.totalAmount - (transaction.amountPaid || 0);
                return;
            }
        }
        
        switch (type) {
            case 'item':
                this.itemModal.style.display = 'block';
                this.itemForm.reset();
                this.itemIdInput.value = '';
                break;
            case 'sale':
                this.saleModal.style.display = 'block';
                this.saleForm.reset();
                this.saleInvoiceInput.value = this.generateInvoiceNumber('sale');
                this.populateItemSelect(this.saleItemSelect);
                this.paidAmountGroup.style.display = 'none';
                break;
            case 'purchase':
                this.purchaseModal.style.display = 'block';
                this.purchaseForm.reset();
                this.purchaseInvoiceInput.value = this.generateInvoiceNumber('purchase');
                this.populateItemSelect(this.purchaseItemSelect);
                this.purchasePaidAmountGroup.style.display = 'none';
                break;
        }
    }

    closeModals() {
        this.itemModal.style.display = 'none';
        this.saleModal.style.display = 'none';
        this.purchaseModal.style.display = 'none';
        this.paymentModal.style.display = 'none';
    }

    populateItemSelect(select) {
        select.innerHTML = '<option value="">Select an item...</option>';
        this.items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.name} (Stock: ${item.quantity})`;
            select.appendChild(option);
        });
    }

    saveItem() {
        const item = {
            id: this.itemIdInput.value || Date.now().toString(),
            name: this.itemNameInput.value,
            category: this.itemCategoryInput.value,
            quantity: parseInt(this.itemQuantityInput.value),
            price: parseFloat(this.itemPriceInput.value),
            lastUpdated: new Date().toISOString()
        };

        if (this.itemIdInput.value) {
            const index = this.items.findIndex(i => i.id === item.id);
            this.items[index] = item;
        } else {
            this.items.push(item);
        }

        this.saveToLocalStorage();
        this.closeModals();
        this.render();
    }

    recordSale() {
        const selectedItem = this.items.find(item => item.id === this.saleItemSelect.value);
        const quantity = parseInt(this.saleQuantityInput.value);
        const customerType = this.customerTypeSelect.value;
        const customerName = this.customerNameInput.value.trim();

        if (!selectedItem) {
            alert('Please select an item');
            return;
        }

        if (quantity > selectedItem.quantity) {
            alert('Not enough stock available');
            return;
        }

        // Save or update customer information for non-walk-in customers
        if (customerType !== 'walkin') {
            this.customers[customerName.toLowerCase()] = {
                type: customerType,
                phone: this.customerPhoneInput.value,
                email: this.customerEmailInput.value,
                lastPurchase: new Date().toISOString()
            };
            localStorage.setItem('customers', JSON.stringify(this.customers));
        }

        const discount = this.discounts[customerType];
        const originalPrice = parseFloat(this.salePriceInput.value);
        const discountedPrice = originalPrice * (1 - discount / 100);

        const sale = {
            id: Date.now().toString(),
            type: 'sale',
            invoiceNumber: this.saleInvoiceInput.value,
            itemId: selectedItem.id,
            itemName: selectedItem.name,
            quantity: quantity,
            unitPrice: discountedPrice,
            originalPrice: originalPrice,
            discount: discount,
            totalAmount: quantity * discountedPrice,
            amountPaid: this.paymentStatusSelect.value === 'paid' ? (quantity * discountedPrice) :
                       this.paymentStatusSelect.value === 'partial' ? parseFloat(this.paidAmountInput.value) : 0,
            paymentStatus: this.paymentStatusSelect.value,
            paymentMethod: this.paymentMethodSelect.value,
            customer: customerName,
            customerType: customerType,
            customerPhone: customerType !== 'walkin' ? this.customerPhoneInput.value : '',
            customerEmail: customerType !== 'walkin' ? this.customerEmailInput.value : '',
            date: new Date().toISOString()
        };

        if (sale.paymentStatus !== 'pending') {
            this.recordPaymentHistory(sale.id, 'sale', sale.amountPaid, sale.paymentMethod);
        }

        // Update stock quantity
        selectedItem.quantity -= quantity;
        selectedItem.lastUpdated = new Date().toISOString();

        this.sales.push(sale);
        this.saveToLocalStorage();
        this.closeModals();
        this.render();
    }

    recordPurchase() {
        const selectedItem = this.items.find(item => item.id === this.purchaseItemSelect.value);
        const quantity = parseInt(this.purchaseQuantityInput.value);

        if (!selectedItem) {
            alert('Please select an item');
            return;
        }

        const purchase = {
            id: Date.now().toString(),
            type: 'purchase',
            invoiceNumber: this.purchaseInvoiceInput.value,
            itemId: selectedItem.id,
            itemName: selectedItem.name,
            quantity: quantity,
            unitPrice: parseFloat(this.purchasePriceInput.value),
            totalAmount: quantity * parseFloat(this.purchasePriceInput.value),
            amountPaid: this.purchasePaymentStatusSelect.value === 'paid' ? 
                       (quantity * parseFloat(this.purchasePriceInput.value)) :
                       this.purchasePaymentStatusSelect.value === 'partial' ? 
                       parseFloat(this.purchasePaidAmountInput.value) : 0,
            paymentStatus: this.purchasePaymentStatusSelect.value,
            paymentMethod: this.purchasePaymentMethodSelect.value,
            supplier: this.supplierNameInput.value,
            date: new Date().toISOString()
        };

        if (purchase.paymentStatus !== 'pending') {
            this.recordPaymentHistory(purchase.id, 'purchase', purchase.amountPaid, purchase.paymentMethod);
        }

        // Update stock quantity
        selectedItem.quantity += quantity;
        selectedItem.lastUpdated = new Date().toISOString();

        this.purchases.push(purchase);
        this.saveToLocalStorage();
        this.closeModals();
        this.render();
    }

    recordPayment() {
        const transactionId = this.paymentTransactionId.value;
        const transactionType = this.paymentTransactionType.value;
        const amount = parseFloat(this.paymentNewAmount.value);
        const method = this.paymentNewMethod.value;
        const taxDeduction = parseFloat(this.paymentTaxDeduction.value) || 0;
        const taxAmount = (amount * taxDeduction) / 100;
        const netAmount = amount - taxAmount;

        const transaction = transactionType === 'sale' ? 
            this.sales.find(s => s.id === transactionId) :
            this.purchases.find(p => p.id === transactionId);

        if (!transaction) {
            alert('Transaction not found');
            return;
        }

        const newTotalPaid = (transaction.amountPaid || 0) + netAmount;
        
        if (newTotalPaid > transaction.totalAmount) {
            alert('Payment amount exceeds total amount due');
            return;
        }

        transaction.amountPaid = newTotalPaid;
        transaction.paymentStatus = newTotalPaid === transaction.totalAmount ? 'paid' : 'partial';

        const paymentDetails = {
            method: method,
            taxDeduction: taxDeduction,
            taxAmount: taxAmount,
            netAmount: netAmount
        };

        if (['bank', 'check'].includes(method)) {
            paymentDetails.bankName = this.paymentBankName.value;
            paymentDetails.transactionRef = this.paymentTransactionRef.value;
            if (method === 'check') {
                paymentDetails.checkNumber = this.paymentCheckNumber.value;
            }
        }

        this.recordPaymentHistory(transactionId, transactionType, amount, paymentDetails);
        this.saveToLocalStorage();
        this.closeModals();
        this.render();
    }

    recordPaymentHistory(transactionId, type, amount, paymentDetails) {
        const payment = {
            id: Date.now().toString(),
            transactionId: transactionId,
            transactionType: type,
            amount: amount,
            ...paymentDetails,
            date: new Date().toISOString()
        };
        this.payments.push(payment);
    }

    updateTaxCalculation() {
        const amount = parseFloat(this.paymentNewAmount.value) || 0;
        const taxPercentage = parseFloat(this.paymentTaxDeduction.value) || 0;
        const taxAmount = (amount * taxPercentage) / 100;
        const netAmount = amount - taxAmount;

        this.taxAmountDisplay.textContent = this.formatPrice(taxAmount);
        this.netAmountDisplay.textContent = this.formatPrice(netAmount);
    }

    generateInvoiceNumber(type) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        
        if (type === 'sale') {
            this.lastSaleInvoice++;
            localStorage.setItem('lastSaleInvoice', this.lastSaleInvoice);
            return `S${year}${month}${this.lastSaleInvoice.toString().padStart(4, '0')}`;
        } else {
            this.lastPurchaseInvoice++;
            localStorage.setItem('lastPurchaseInvoice', this.lastPurchaseInvoice);
            return `P${year}${month}${this.lastPurchaseInvoice.toString().padStart(4, '0')}`;
        }
    }

    getFilteredItems() {
        let filtered = [...this.items];
        
        if (this.categoryFilter.value) {
            filtered = filtered.filter(item => 
                item.category === this.categoryFilter.value
            );
        }

        const searchTerm = this.searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm)
            );
        }

        return filtered;
    }

    getFilteredTransactions(transactions, searchInput, dateFilter) {
        let filtered = [...transactions];
        
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(trans =>
                trans.itemName.toLowerCase().includes(searchTerm) ||
                (trans.customer && trans.customer.toLowerCase().includes(searchTerm)) ||
                (trans.supplier && trans.supplier.toLowerCase().includes(searchTerm))
            );
        }

        if (dateFilter.value) {
            const filterDate = new Date(dateFilter.value).toDateString();
            filtered = filtered.filter(trans =>
                new Date(trans.date).toDateString() === filterDate
            );
        }

        return filtered;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleString();
    }

    formatPrice(price) {
        return `$${price.toFixed(2)}`;
    }

    getPaymentStatusBadgeClass(status) {
        switch (status) {
            case 'paid': return 'status-success';
            case 'pending': return 'status-warning';
            case 'partial': return 'status-info';
            default: return '';
        }
    }

    render() {
        // Render inventory
        const filteredItems = this.getFilteredItems();
        this.stockList.innerHTML = filteredItems.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td class="${item.quantity < 10 ? 'low-stock' : ''}">${item.quantity}</td>
                <td>${this.formatPrice(item.price)}</td>
                <td>${this.formatDate(item.lastUpdated)}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="stockApp.editItem('${item.id}')">
                        Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="stockApp.deleteItem('${item.id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');

        // Render sales
        const filteredSales = this.getFilteredTransactions(this.sales, this.salesSearch, this.salesDateFilter);
        this.salesList.innerHTML = filteredSales.map(sale => `
            <tr>
                <td>${sale.invoiceNumber}</td>
                <td>${this.formatDate(sale.date)}</td>
                <td>${sale.itemName}</td>
                <td>${sale.quantity}</td>
                <td>
                    ${this.formatPrice(sale.unitPrice)}
                    ${sale.discount > 0 ? `<span class="discount-badge">${sale.discount}% off</span>` : ''}
                </td>
                <td>${this.formatPrice(sale.totalAmount)}</td>
                <td>
                    <span class="status-badge ${this.getPaymentStatusBadgeClass(sale.paymentStatus)}">
                        ${sale.paymentStatus}
                    </span>
                    ${sale.amountPaid ? `<br>${this.formatPrice(sale.amountPaid)} paid` : ''}
                    ${this.getPaymentDetails(sale.id)}
                </td>
                <td>
                    ${sale.customer}
                    <span class="customer-type-badge ${sale.customerType}">${sale.customerType}</span>
                    ${sale.customerPhone ? `<br>📞 ${sale.customerPhone}` : ''}
                </td>
                <td>
                    ${sale.paymentStatus !== 'paid' ? 
                        `<button class="action-btn payment-btn" onclick="stockApp.openModal('payment', '${sale.id}')">
                            Record Payment
                        </button>` : ''}
                </td>
            </tr>
        `).join('');

        // Render purchases
        const filteredPurchases = this.getFilteredTransactions(this.purchases, this.purchasesSearch, this.purchasesDateFilter);
        this.purchasesList.innerHTML = filteredPurchases.map(purchase => `
            <tr>
                <td>${purchase.invoiceNumber}</td>
                <td>${this.formatDate(purchase.date)}</td>
                <td>${purchase.itemName}</td>
                <td>${purchase.quantity}</td>
                <td>${this.formatPrice(purchase.unitPrice)}</td>
                <td>${this.formatPrice(purchase.totalAmount)}</td>
                <td>
                    <span class="status-badge ${this.getPaymentStatusBadgeClass(purchase.paymentStatus)}">
                        ${purchase.paymentStatus}
                    </span>
                    ${purchase.amountPaid ? `<br>${this.formatPrice(purchase.amountPaid)} paid` : ''}
                    ${this.getPaymentDetails(purchase.id)}
                </td>
                <td>${purchase.supplier}</td>
                <td>
                    ${purchase.paymentStatus !== 'paid' ? 
                        `<button class="action-btn payment-btn" onclick="stockApp.openModal('payment', '${purchase.id}')">
                            Record Payment
                        </button>` : ''}
                </td>
            </tr>
        `).join('');
    }

    getPaymentDetails(transactionId) {
        const payments = this.payments.filter(p => p.transactionId === transactionId);
        if (payments.length === 0) return '';

        return payments.map(payment => `
            <div class="payment-detail">
                <small>
                    ${this.formatDate(payment.date)}<br>
                    ${this.formatPrice(payment.amount)} via ${payment.method}
                    ${payment.taxDeduction > 0 ? `<br>Tax: ${payment.taxDeduction}% (${this.formatPrice(payment.taxAmount)})` : ''}
                    ${payment.checkNumber ? `<br>Check #${payment.checkNumber}` : ''}
                    ${payment.bankName ? `<br>Bank: ${payment.bankName}` : ''}
                </small>
            </div>
        `).join('');
    }

    editItem(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            this.openModal('item');
            this.itemIdInput.value = item.id;
            this.itemNameInput.value = item.name;
            this.itemCategoryInput.value = item.category;
            this.itemQuantityInput.value = item.quantity;
            this.itemPriceInput.value = item.price;
        }
    }

    deleteItem(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.items = this.items.filter(item => item.id !== id);
            this.saveToLocalStorage();
            this.render();
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('stockItems', JSON.stringify(this.items));
        localStorage.setItem('salesRecords', JSON.stringify(this.sales));
        localStorage.setItem('purchaseRecords', JSON.stringify(this.purchases));
        localStorage.setItem('customers', JSON.stringify(this.customers));
        localStorage.setItem('paymentRecords', JSON.stringify(this.payments));
        localStorage.setItem('lastSaleInvoice', this.lastSaleInvoice);
        localStorage.setItem('lastPurchaseInvoice', this.lastPurchaseInvoice);
    }
}

const stockApp = new StockManagement();
