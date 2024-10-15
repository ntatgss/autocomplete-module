'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Edit, Lightbulb, Zap } from 'lucide-react'

export default function HomePage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center space-y-4 text-center"
              initial="initial"
              animate="animate"
              variants={fadeIn}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Revolutionize Your Writing with AI
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Harness the power of advanced AI models to draft, edit, and perfect your content in real-time.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/draft">
                  <Button size="lg" className="w-full sm:w-auto">Start Drafting</Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">Learn More</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">How It Works</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <Card>
                  <CardHeader>
                    <Edit className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle>Real-Time Drafting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Write with the assistance of AI, getting suggestions and completions as you type.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <Card>
                  <CardHeader>
                    <Lightbulb className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle>Smart Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Receive context-aware suggestions to improve your writing style and content.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <Card>
                  <CardHeader>
                    <Zap className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle>Multiple AI Models</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Choose from various AI models to find the perfect fit for your writing needs.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
        <section id="models" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Supported AI Models</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <Card>
                  <CardHeader>
                    <CardTitle>OpenAI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Leverage the power of GPT models for human-like text generation and understanding.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Anthropic Claude</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Utilize Claude's advanced language capabilities for nuanced and contextual writing assistance.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <Card>
                  <CardHeader>
                    <CardTitle>LMStudio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Explore custom-trained models tailored for specific writing tasks and industries.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Users Say</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:gap-12">
              <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-lg mb-2">"This AI tool has completely transformed my writing process. It's like having a brilliant writing partner available 24/7!"</p>
                    <p className="font-semibold">- Sarah J., Content Creator</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-lg mb-2">"The real-time suggestions have helped me overcome writer's block countless times. It's an indispensable tool for any writer."</p>
                    <p className="font-semibold">- Mark T., Novelist</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Frequently Asked Questions</h2>
            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>How does the AI drafting tool work?</AccordionTrigger>
                  <AccordionContent>
                    Our AI drafting tool uses advanced language models to provide real-time suggestions and completions as you write. It analyzes your text, understands the context, and offers relevant suggestions to improve your writing.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is my writing data secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we take data security very seriously. All your writing data is encrypted and never shared with third parties. We only use it to provide and improve our service.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I use this tool for any type of writing?</AccordionTrigger>
                  <AccordionContent>
                    Our AI drafting tool is versatile and can assist with various types of writing, including articles, essays, stories, emails, and more. The AI adapts to your writing style and the context of your work.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center space-y-4 text-center"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Writing?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join thousands of writers who have already elevated their craft with our AI-powered drafting tool.
                </p>
              </div>
              <div>
                <Link href="/draft">
                  <Button size="lg" className="w-full sm:w-auto">Start Drafting Now</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-background">
        <div className="container px-4 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 AI Drafting Tool. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}