export type FaqItem = {
  q: string;
  a: string;
};

export const faqs: { category: string; items: FaqItem[] }[] = [
  {
    category: "Ordering & payment",
    items: [
      {
        q: "How do I place an order?",
        a: "Add items to your cart, checkout with your name and phone, then pay with MTN MoMo, Airtel Money or Zamtel Money. You can also order on WhatsApp."
      },
      {
        q: "Do you accept Mobile Money?",
        a: "Yes — MTN MoMo, Airtel Money and Zamtel Money. Payment details appear at checkout."
      },
      {
        q: "How do I track my shop order?",
        a: "Use Track order with your order reference (e.g. GP-XXXXXX) from checkout or your account. Printing jobs use a separate services track link."
      }
    ]
  },
  {
    category: "Delivery & pickup",
    items: [
      {
        q: "Where can I pick up?",
        a: "UNZA (Kafue Small Gate & Ridgeway), Kalingalinga (Sikwazi Road) and Balastone (Eden University). Hours are listed on each location card."
      },
      {
        q: "Is campus delivery free?",
        a: "Free delivery within school/campus applies where we offer it. Lusaka and nationwide delivery are available — see Delivery & Pickup for details."
      }
    ]
  },
  {
    category: "Printing",
    items: [
      {
        q: "How does Upload & Print work?",
        a: "Upload your files → choose options → pay → we print → collect or arrange delivery. Your original-quality files are securely sent to our printing team."
      },
      {
        q: "Will my files stay high quality?",
        a: "Yes. We keep original-quality uploads for printing — no low-res WhatsApp compression required."
      }
    ]
  },
  {
    category: "Products & returns",
    items: [
      {
        q: "Are products genuine?",
        a: "We stock genuine products at fair prices. Check Warranty and Returns pages for after-sales details."
      },
      {
        q: "Can I return an item?",
        a: "See our Returns & Refunds policy. Unopened items in original condition may qualify within the stated window — contact us on WhatsApp with your order ref."
      }
    ]
  },
  {
    category: "Accounts & G-Loans",
    items: [
      {
        q: "Do I need an account?",
        a: "You can browse and checkout as a guest with your phone number. Creating an account saves your details and order history."
      },
      {
        q: "What is G-Loans?",
        a: "Short-term collateral-based loans from our Services Centre. See G-Loans Terms and submit a request online — our team follows up on WhatsApp."
      }
    ]
  }
];
