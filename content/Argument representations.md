
## Models:
- Toulmin
- Standard form
- AIF
- Walton schemes

Any of these models provide type for premises?
[Six most common types of claim are: **fact, definition, value, cause, comparison,** and **policy**](https://lsa.umich.edu/sweetland/instructors/guides-to-teaching-writing/teaching-argumentation.html?utm_source=chatgpt.com)
## Layers:
<span style="background:#fff88f"><b>The idea of having multiple layer is that it could be all inclusive. A unique set of layers for (i) methodology for analysing argument, (ii) platform that helps people understand argument.</b></span>
<span style="background:#fff88f">I suppose people need more than argumentation methodology to understand arguments. They probably need fact, different information, among other things.</span>
<b>Then I need to separate the layers. But it's pretty clear actually.</b>
- Original text
- Arguments
	- Label the actual text
	- Reformat (maybe margin comments)
		- Toulmin model
		- Standard form
		- AIF
			- Basic:
				- I-node (information): represent a proposition, e.g. a premise, a claim, or a conclusion
				- S-node (scheme): represent a relationship or reasoning process connecting information
					- RA-node: inference or support
					- CA-node: Conflict or attack between claim or arguments.
			- One of the characteristic could be that there are units/entities to represent inferences, i.e. between premises, which allow users to challenge the specific link between premises
		- Premises
			- Type
		- Inference 
			- Type
	- Alternative interpretation (rebuttal?)
	- What's required to realize the alternative
	- How can the argument be strengthen?
- Definitions
- Evidence
	- Fact check
- Logic
	- Fallacies
- Rhetoric
- Implicit value
- Links between arguments inter- and infra- discussions
- Types of edges
- Different domain experts
- Thumb up down
- Comments

## Tasks (2026-11-25)
- Evaluate the usefulness of the different layers
	- I guess the usefulness is revealed by whether the models could aid the reader to ask the critical questions (as in Walton's schemes)
		- <span style="background:#b1ffff">How effectively does an argument representation help readers <b>identify, prioritize, and investigate the questions most consequential to the argument's conclusion?</b></span>
		- For ZK1, the critical question would be how "C-A" is established. Perhaps that's the value of Walton's work.
- The 2 types of UI:
	- For readers
	- For analysts
- Can the layerization be done without AI?

### UI design
- I like the markdown approach of annotating text/articles (can extend to XML for diverse or support user-define labels)
    - Could be easier for the UI programming, i.e. less or no buttons at this point.
- I possibly need a tree structure of labels (layers?), a bit like quotation, arguments (i.e. labeling a specific text as argument), definitions (i.e. the speaker defined a good way of characterization of a religion is through the live practice of the followers), evidence.
    - And within each layer(?), there could be additional labels, e.g. within argument, if in the standard form then it's premise 1 ... n and conclusion, if in Toulmin's model then it's {claim, warrant, ground, backing, qualifier, ... etc}, similarly for other representations. And then the "contributors" would probably want to use their own labels for the arguments, i.e. ZK1 or For_speaker_1 or logic_based_argument_1, evidence_based_argument_1 ... etc.
    - Similarly, AIF would have its own set of sub-labels, I-nodes, S-nodes ... etc
    - One complication would be to first define the labels set according to the different frameworks, and be compatible with the users' own labels
- The labels would likely overlap, i.e. a sentence can be evience, but also part of an argument.
- Like in Obsidian, the contributors would annotate the text, then the browser would render it into an interactive viewing format
- The markdown approach makes it easier for the contributors, but I'm not sure if it's better to store the annotation in a database down the line, which I can then implement user rating ... etc.
- I imagine the rendered mode would show the original text, then the users could select different layers which would be highlighted in the text, i.e. the arguments are highlighted in red, evidences as green ... etc. Then, perhaps like the 2 columns layout in threads, where one column is the original text and the second column could show the standard form, or Toulmin's model, or the AIF diagram.
- I would imagine the UI for the argument representations to be similar to the Obsidian Callouts (Admonitions).  
Not sure how to allow both structure and flexibility. It's essential for the UI to be intuitive enough to guide the users', both the contributors and readers, critical thinking.