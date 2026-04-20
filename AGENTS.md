<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:ui-component-rules -->

# Always use the installed UI components

This project uses **shadcn/ui** components located in `components/ui/`. Before writing any form element or layout primitive, check that directory first.

**Never use raw HTML elements when a UI component exists:**

| Instead of…                  | Use…                                                                                                            |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `<input>`                    | `<Input>` from `@/components/ui/input`                                                                          |
| `<textarea>`                 | `<Textarea>` from `@/components/ui/textarea`                                                                    |
| `<select>` / `<option>`      | `<Select>`, `<SelectTrigger>`, `<SelectValue>`, `<SelectContent>`, `<SelectItem>` from `@/components/ui/select` |
| `<label>`                    | `<Label>` from `@/components/ui/label`                                                                          |
| `<button>` (primary actions) | `<Button>` from `@/components/ui/button`                                                                        |
| Custom card `<div>` wrappers | `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardContent>`, `<CardFooter>` from `@/components/ui/card`            |
| Custom dialog/modal          | `<Dialog>` from `@/components/ui/dialog`                                                                        |
| Custom dropdown              | `<DropdownMenu>` from `@/components/ui/dropdown-menu`                                                           |
| Custom badge/pill            | `<Badge>` from `@/components/ui/badge`                                                                          |
| Custom avatar                | `<Avatar>` from `@/components/ui/avatar`                                                                        |
| Custom checkbox              | `<Checkbox>` from `@/components/ui/checkbox`                                                                    |
| Custom separator             | `<Separator>` from `@/components/ui/separator`                                                                  |
| Custom tooltip               | `<Tooltip>` from `@/components/ui/tooltip`                                                                      |
| Custom scroll area           | `<ScrollArea>` from `@/components/ui/scroll-area`                                                               |
| Custom table                 | `<Table>` from `@/components/ui/table`                                                                          |
| Custom sheet/drawer          | `<Sheet>` from `@/components/ui/sheet`                                                                          |
| Custom alert dialog          | `<AlertDialog>` from `@/components/ui/alert-dialog`                                                             |

All components accept a `className` prop for Tailwind overrides. Use it rather than wrapping in another element.

For `Select`, use `onValueChange` (not `onChange`) because it is Radix-based.

<!-- END:ui-component-rules -->
