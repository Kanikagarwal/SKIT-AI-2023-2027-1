6/9/26- Read the research paper titled "Handwritten Text Recognition: A Survey".
https://doi.org/10.48550/arXiv.2502.08417

Summary- Overview of HTR from line-level to full-document recognition, covering modern deep-learning/Transformer approaches, datasets, evaluation metrics, and challenges such as reading order and generalization.

9/9/26- Read the research paper titled "OmniHandwritingOCR: A Diagnostic Benchmark for Evaluating Multimodal LLMs in Handwritten OCR Scenarios."
https://doi.org/10.48550/arXiv.2608.18586

Summary- Introduces OmniHandwritingOCR, a benchmark to evaluate MLLMs and OCR models on real handwritten text and mathematical expressions. It contains 77K+ image-label pairs covering English, Chinese, and handwritten mathematics. The paper focuses on faithful transcription, where models should reproduce exactly what is written instead of correcting spelling or mathematical mistakes.

15/9/26- Read the research paper titled "PP-OCR: A Practical Ultra Lightweight OCR System." https://doi.org/10.48550/arXiv.2009.09941

Summary- Introduces PP-OCR, a practical and lightweight OCR system designed to balance recognition accuracy and computational efficiency. It uses a pipeline of text detection, text direction classification, and text recognition, with techniques such as lightweight networks, data augmentation, model pruning, and quantization to reduce model size and inference cost. The system achieves a model size of 3.5 MB for Chinese recognition and 2.8 MB for alphanumeric recognition, while being evaluated on large-scale real and synthetic datasets.

6/9/26- Read the research paper titled "TrOCR: Transformer-based Optical Character Recognition with Pre-trained Models." https://doi.org/10.48550/arXiv.2109.10282

Summary- Introduces TrOCR, a Transformer-based OCR system that uses a pretrained image Transformer as an encoder and a pretrained language model as a decoder for text recognition. It is trained using large-scale synthetic and real text datasets and evaluated on printed, handwritten, and scene text recognition tasks. For handwritten text recognition, TrOCR achieves strong results on the IAM dataset, showing how Transformer-based pretraining can improve recognition accuracy compared with traditional CNN-RNN-CTC approaches.