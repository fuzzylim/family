import { HtmlValidate } from "html-validate";
import { globby } from "globby";
import { readFile } from "fs/promises";
import path from "path";

async function validateFiles() {
  const htmlvalidate = new HtmlValidate();
  
  try {
    // Find all HTML and TSX files
    const files = await globby(["**/*.html", "**/*.tsx"], {
      ignore: ["node_modules/**", ".next/**", "out/**"]
    });

    let totalErrors = 0;
    let totalWarnings = 0;

    // Validate each file
    for (const file of files) {
      const content = await readFile(file, "utf8");
      const report = await htmlvalidate.validateString(content, {
        filename: file
      });

      if (report.errorCount > 0 || report.warningCount > 0) {
        console.log(`\nFile: ${file}`);
        report.results.forEach((result) => {
          result.messages.forEach((message) => {
            const type = message.severity === 2 ? "Error" : "Warning";
            console.log(`  ${type}: Line ${message.line}, Column ${message.column}: ${message.message}`);
          });
        });
      }

      totalErrors += report.errorCount;
      totalWarnings += report.warningCount;
    }

    // Print summary
    console.log("\nValidation Summary:");
    console.log(`Total files checked: ${files.length}`);
    console.log(`Total errors: ${totalErrors}`);
    console.log(`Total warnings: ${totalWarnings}`);

    // Exit with error if there are any errors
    if (totalErrors > 0) {
      console.error("\nHTML validation failed!");
      process.exit(1);
    } else {
      console.log("\nHTML validation passed!");
    }
  } catch (error) {
    console.error("Validation failed:", error);
    process.exit(1);
  }
}

validateFiles();

