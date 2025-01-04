// DOM Elements
const addItemBtn = document.getElementById("addItemBtn");
const itemModal = document.getElementById("itemModal");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const itemForm = document.getElementById("itemForm");
console.log("Item form element:", itemForm);

// State
let editingId = null;

// Open modal for adding or editing item
function openModal(editing = false) {
  itemModal.classList.add("active");
  document.getElementById("modalTitle").textContent = editing
    ? "Edit Item"
    : "Add New Item";
}

function closeModalHandler() {
  itemModal.classList.remove("active");
  itemForm.reset();
  editingId = null;
}

// Form submit handler for adding/editing
async function handleSubmit(e) {
  e.preventDefault();
  console.log("Event received:", e);

  // Debug logs before creating formData
  console.log("Select element:", document.getElementById("itemType")); // Check if element exists
  console.log("Selected value:", document.getElementById("itemType")?.value); // Check its value

  const itemTypeElement = document.getElementById("itemType");
  if (!itemTypeElement) {
    console.error("Element with id 'itemType' not found in DOM!");
  }

  const formData = {
    name: document.getElementById("itemName").value,
    vendor: document.getElementById("itemVendor").value, // Ensure this matches the input id in HTML
    typeofitem: document.getElementById("itemType").value,
    quantity: parseInt(document.getElementById("itemQuantity").value),
    price: parseFloat(document.getElementById("itemPrice").value),
  };

  try {
    let response;
    if (editingId) {
      // Update existing item on Django
      response = await fetch(`/api/inventory/${editingId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Item updated successfully");
      } else {
        alert("Failed to update item");
      }
    } else {
      // Add new item to Django
      console.log(formData);
      response = await fetch("/api/inventory/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Item added successfully");
      } else {
        alert("Failed to add item");
      }
    }
    console.log("Data successfully sent to Django:", formData); // Debugging
    // Reload the page to show updated data
    window.location.reload();
  } catch (error) {
    console.error("Error submitting data to Django:", error); // Error handling
  }

  closeModalHandler();
}

// Delete item from Django backend
async function deleteItem(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    try {
      const response = await fetch(`/api/inventory/delete${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert(`Item with id ${id} successfully deleted`);
        // Reload the page to reflect the deletion
        window.location.reload();
      } else {
        alert("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }
}

// Event Listeners
addItemBtn.addEventListener("click", () => openModal(false));
closeModal.addEventListener("click", closeModalHandler);
cancelBtn.addEventListener("click", closeModalHandler);
itemForm.addEventListener("submit", handleSubmit);

// Event delegation for edit and delete buttons
document.getElementById("inventoryList").addEventListener("click", (e) => {
  const editBtn = e.target.closest(".edit-btn");
  const deleteBtn = e.target.closest(".delete-btn");

  if (editBtn) {
    const id = parseInt(editBtn.dataset.id);
    editingId = id;
    document.getElementById("itemName").value = editBtn.dataset.name;
    document.getElementById("itemVendor").value = editBtn.dataset.vendor; // Set the vendor field for editing
    document.getElementById("itemType").value = editBtn.dataset.typeofitem;
    document.getElementById("itemQuantity").value = editBtn.dataset.quantity;
    document.getElementById("itemPrice").value = editBtn.dataset.price;
    openModal(true);
  }

  if (deleteBtn) {
    const id = parseInt(deleteBtn.dataset.id);
    deleteItem(id);
  }
});

// Close modal when clicking outside
itemModal.addEventListener("click", (e) => {
  if (e.target === itemModal) {
    closeModalHandler();
  }
});
