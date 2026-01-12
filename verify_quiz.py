"""
Script para verificar e corrigir a numeração dos steps do quiz
"""

# Estrutura correta do quiz
CORRECT_STRUCTURE = {
    0: "Landing",
    1: "¿Cuántos kilos?",
    2: "¿Mayor obstáculo?",
    3: "¿Parte del cuerpo?",
    4: "SCANNER (automático)",
    5: "¿Dolor de cabeza?",
    6: "¿Cuerpo trabado?",
    7: "TESTIMONIALS (automático)",
    8: "¿Autoestima?",
    9: "¿Cuerpo pesado?",
    10: "¿Te hinchas?",
    11: "¿Mayor miedo?",
    12: "¿Ya compraste?",
    13: "¿Darías el paso?",
    14: "Formulário",
    15: "Loading",
    16: "VSL"
}

# Navegação correta
NAVIGATION = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    4: 5,  # Scanner avança automaticamente
    5: 6,
    6: 7,
    7: 8,  # Testimonials avança automaticamente
    8: 9,
    9: 10,
    10: 11,
    11: 12,
    12: 13,
    13: 14,
    14: 15,
    15: 16
}

print("ESTRUTURA CORRETA DO QUIZ:")
print("=" * 50)
for step, desc in CORRECT_STRUCTURE.items():
    next_step = NAVIGATION.get(step, "FIM")
    print(f"Step {step}: {desc} → {next_step}")
