"""
Trains and benchmarks Decision Tree, Random Forest, Naive Bayes, and a
Voting Ensemble on the symptom-to-disease dataset, and saves the
best-performing model for the Flask inference service.

Expected input: ml-service/data/dataset.csv
  - Column 'Disease' (target)
  - Columns 'Symptom_1' .. 'Symptom_17' each containing a symptom NAME
    (text, not binary) or blank/NaN if unused for that row.

This script converts the per-row symptom-name columns into a multi-hot
binary matrix (one column per distinct symptom) before training, since
scikit-learn classifiers need numeric binary features.

Usage:
  python train_model.py
"""

import json
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, f1_score

DATA_PATH = "data/dataset.csv"
MODEL_OUT = "models/symptom_classifier.joblib"
LABELS_OUT = "models/label_encoder.joblib"
SYMPTOMS_OUT = "models/symptom_columns.json"

TARGET_COL = "Disease"
SYMPTOM_COL_PREFIX = "Symptom_"


def clean_symptom(value):
    if pd.isna(value):
        return None
    return str(value).strip().lower().replace(" ", "_")


def load_data():
    df = pd.read_csv(DATA_PATH)
    df = df.drop_duplicates()

    symptom_cols = [c for c in df.columns if c.startswith(SYMPTOM_COL_PREFIX)]

    all_symptoms = set()
    for col in symptom_cols:
        for val in df[col]:
            cleaned = clean_symptom(val)
            if cleaned:
                all_symptoms.add(cleaned)
    all_symptoms = sorted(all_symptoms)

    multi_hot = pd.DataFrame(0, index=df.index, columns=all_symptoms)
    for col in symptom_cols:
        for idx, val in df[col].items():
            cleaned = clean_symptom(val)
            if cleaned:
                multi_hot.at[idx, cleaned] = 1

    X = multi_hot
    y = df[TARGET_COL]
    return X, y, all_symptoms


def main():
    X, y, symptom_cols = load_data()

    encoder = LabelEncoder()
    y_encoded = encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )

    # Stronger, better-calibrated candidates: more trees, no depth cap
    # removed, bootstrap probability estimates sharpen with more trees.
    dt = DecisionTreeClassifier(random_state=42)
    rf = RandomForestClassifier(
        n_estimators=500,
        max_features="sqrt",
        min_samples_leaf=1,
        random_state=42,
        n_jobs=-1,
    )
    nb = GaussianNB()

    # Soft-voting ensemble: averages predicted probabilities across all
    # three models, which tends to produce sharper, more trustworthy
    # confidence scores than any single tree-based model alone.
    voting = VotingClassifier(
        estimators=[("dt", dt), ("rf", rf), ("nb", nb)],
        voting="soft",
    )

    candidates = {
        "decision_tree": dt,
        "random_forest": rf,
        "naive_bayes": nb,
        "voting_ensemble": voting,
    }

    results = {}
    best_name, best_model, best_f1 = None, None, -1

    for name, model in candidates.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        acc = accuracy_score(y_test, preds)
        f1 = f1_score(y_test, preds, average="weighted")
        results[name] = {"accuracy": round(acc, 4), "f1_score": round(f1, 4)}
        print(f"{name}: accuracy={acc:.4f}  f1={f1:.4f}")

        if f1 >= best_f1:
            best_name, best_model, best_f1 = name, model, f1

    print(f"\nBest model: {best_name} (f1={best_f1:.4f})")

    joblib.dump(best_model, MODEL_OUT)
    joblib.dump(encoder, LABELS_OUT)
    with open(SYMPTOMS_OUT, "w") as f:
        json.dump(symptom_cols, f)

    with open("models/benchmark_results.json", "w") as f:
        json.dump({"results": results, "best_model": best_name}, f, indent=2)

    print(f"Saved model to {MODEL_OUT}")


if __name__ == "__main__":
    main()
